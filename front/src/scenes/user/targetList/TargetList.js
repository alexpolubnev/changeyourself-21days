import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TargetHead from "./TargetHead";
import TargetDay from "./TargetDay";

class TargetList extends React.Component {
  constructor(props) {
    super(props);
    this.deleteTarget = this.deleteTarget.bind(this);
  }
  state = {
    target: ["123"],
    days: "",
    hours: "",
    minutes: "",
    seconds: "",
    deleteTarget: false
  };

  getCountdown() {
    const date = Date.parse(this.state.target.endDate);
    let days, hours, minutes, seconds;
    const target_date = date;

    let current_date = new Date().getTime();
    let seconds_left = (target_date - current_date) / 1000;

    days = this.pad(parseInt(seconds_left / 86400));
    seconds_left = seconds_left % 86400;

    hours = this.pad(parseInt(seconds_left / 3600));
    seconds_left = seconds_left % 3600;

    minutes = this.pad(parseInt(seconds_left / 60));
    seconds = this.pad(parseInt(seconds_left % 60));

    this.setState({ days, hours, minutes, seconds });
  }

  pad(n) {
    return (n < 10 ? "0" : "") + n;
  }

  async componentDidMount() {
    const action = await (
      await fetch(
        `http://localhost:5000/user/target/${this.props.match.params.id}`,
        { method: "GET" }
      )
    ).json();
    this.setState({ target: action.target });

    if (new Date() - Date.parse(this.state.target.endDate) < 0) {
      this.getCountdown();
    }
  }

  componentDidUpdate() {
    if (new Date() - Date.parse(this.state.target.endDate) < 0) {
      setTimeout(() => {
        this.getCountdown();
      }, 1000);
    }
  }

  async deleteTarget() {
    const { id } = this.props.match.params;
    const url = "http://localhost:5000/user/target/" + id;
    this.props.history.push("/user");
    await fetch(url, { method: "DELETE" });
  }

  render() {
    const target = this.state.target;
    let text = false;
    let time = new Date() - Date.parse(target.endDate);

    if (time <= 0) {
      const { days, hours, minutes, seconds } = this.state;
      text = `Осталось ${days}д ${hours}ч ${minutes}м ${seconds}с`;
    }
    let counter = -86400000;
    let date = Date.parse(target.startDate);
    return (
      <>
        <TargetHead target={target} text={text} />
        <div className="target:hover">
          <h2 className="target__title"></h2>
          {target.actions &&
            target.actions.map(elem => {
              counter += 86400000;
              return (
                <TargetDay
                  day={elem}
                  id={target._id}
                  date={date}
                  counter={counter}
                />
              );
            })}
        </div>
        {this.state.deleteTarget ? (
          <div className="edit-block">
            <span>Вы точно хотите удалить цель?</span>
            <div>
              <i className="icono-check" onClick={this.deleteTarget}></i>
              <i
                className="icono-cross"
                onClick={() => {
                  this.setState({
                    deleteTarget: !this.state.deleteTarget
                  });
                }}
              ></i>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              this.setState({
                deleteTarget: !this.state.deleteTarget
              });
            }}
            className="delete"
          >
            Удалить цель
          </button>
        )}
      </>
    );
  }
}
const mapStateToProps = state => ({
  isLoggined: state.isLoggined,
  targets: state.targets
});
export default withRouter(connect(mapStateToProps)(TargetList));
