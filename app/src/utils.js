const formatStringToTime = (time) => {
    const parsedTime = time.split(':');
    return parseInt(parsedTime[0])*3600
        + parseInt(parsedTime[1]) * 60
        + parseInt(parsedTime[2]);
};

const formatMillisToTime = (t) => {
    t = t/1000;
    let h = Math.floor(t/3600);
    let m = Math.floor((t-h*3600)/60);
    let s = Math.floor(t-h*3600-m*60);
    return {h, m, s};
}

const formatTimestamp = (t) => {
    return new Date(t);
};

export { formatStringToTime, formatMillisToTime, formatTimestamp };
