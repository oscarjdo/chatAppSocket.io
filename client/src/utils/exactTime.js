const exactTime = (currentTime, fileRef, useCurrentTime) => {
  let time;

  if (useCurrentTime) time = currentTime;
  else time = fileRef.current ? fileRef.current.duration : 0;

  let minutes = 0;
  let hours = 0;
  time = Math.round(time);

  while (time > 59) {
    time -= 60;
    minutes++;

    if (minutes > 59) {
      minutes -= 60;
      hours++;
    }
  }

  if (time < 10) time = `0${time}`;
  if (minutes < 10) minutes = `0${minutes}`;
  if (hours < 10) hours = `0${hours}`;

  return `${hours > 0 ? hours + ":" : ""}${
    minutes > 0 || hours > 0 ? minutes + ":" : "00:"
  }${time}`;
};

export default exactTime;
