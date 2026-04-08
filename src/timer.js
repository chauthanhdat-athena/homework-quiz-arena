export class Timer {
  constructor({ duration, onTick, onExpire }) {
    this._duration = duration;
    this._onTick = onTick;
    this._onExpire = onExpire;
    this._remaining = duration;
    this._id = null;
  }

  start() {
    this.stop();
    this._remaining = this._duration;
    this._onTick(this._remaining);
    this._id = setInterval(() => {
      this._remaining--;
      this._onTick(this._remaining);
      if (this._remaining <= 0) {
        this.stop();
        this._onExpire();
      }
    }, 1000);
  }

  stop() {
    if (this._id !== null) {
      clearInterval(this._id);
      this._id = null;
    }
  }
}
