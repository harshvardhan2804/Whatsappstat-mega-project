
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("report").style.display = "none";
});
window.onload = function () {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        Chart.plugins.register({
            beforeDraw: function (chartInstance) {
                var ctx = chartInstance.chart.ctx;
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
            }
        });
        var initial = document.getElementById("initial");
        var report = document.getElementById("report");
        report.style.display = "none";
        var fileSelected = document.getElementById('txtfiletoread');
        fileSelected.addEventListener('change', function (e) {
            var fileExtension = /text.*/;
            var fileTobeRead = fileSelected.files[0];
            if (fileTobeRead.type.match(fileExtension)) {
                var fileReader = new FileReader();
                fileReader.onload = function (e) {
                    var sender = fileReader.result.match(/[-\]](\s\w+)+[:]/g);
                    var count = {};
                    var countEmoji = {};
                    var datetime = fileReader.result.match(/(\d+[\/.]\d+[\/.]\d+)([^-\]]*)/g);
                    var date = [];
                    var time = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    var emoji = fileReader.result.match(/[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug)
                    sender.forEach(function (element, i) {
                        sender[i] = sender[i].replace("- ", "").replace(":", "").replace("]", "");
                    });
                    sender.forEach(element => {
                        count[element] = (count[element] || 0) + 1;
                    });
                    if (emoji !== null) {
                        emoji.forEach(element => {
                            countEmoji[element] = (countEmoji[element] || 0) + 1;
                        });
                    }
                    datetime.forEach(element => {
                        try {
                            date.push(element.match(/(\d+[\/.]\d+[\/.]\d+)/g)[0]);
                            if (element.search(/[aA]/) != -1)
                                time[Number(element.match(/[-+]?\s\d+:/g)[0].replace(":", "").replace(" ", "")) % 12]++;

                            else if (element.search(/[pP]/) != -1)
                                time[Number(element.match(/[-+]?\s\d+:/g)[0].replace(":", "").replace(" ", "")) == 12 ? 12 : Number(element.match(/[-+]?\s\d+:/g)[0].replace(":", "").replace(" ", "")) + 12]++;
                            else
                                time[Number(element.match(/[-+]?\s\d+:/g)[0].replace(":", "").replace(" ", ""))]++;
                        }
                        catch(TypeError){};
                        });
                    plotSenderGraph(count);
                    plotTimeGraph(time);
                    if (emoji !== null)
                        plotEmojiGraph(countEmoji);
                    plotDayGraph(date);
                    initial.style.display = "none";
                    report.style.display = "block";
                }
                fileReader.readAsText(fileTobeRead);

            }
            else {
                alert("Please select text file");
            }

        }, false);
    }
    else {
        alert("Files are not supported");
    }
}

function plotSenderGraph(count) {
    var senderName = [];
    var senderCount = [];
    var total = 0;
    for (var key in count) {
        if (count.hasOwnProperty(key)) {
            if (key.match(/http/) == null) {
                senderName.push(key);
                senderCount.push(count[key]);
                total += count[key];
            }
        }
    }
    totalText = document.getElementById("totalText");
    totalText.innerHTML = '<div class="high">' + total + '</div>' + "Messages Were Sent";
    var i = senderCount.indexOf(Math.max(...senderCount));
    senderText = document.getElementById("senderText");
    senderText.innerHTML = '<div class="high">' + senderCount[i] + '</div>' + "Messages Were Sent By " + senderName[i];

    var ctx = document.getElementById("senderChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: senderName,
            datasets: [{
                label: '# of Messages',
                data: senderCount,
                backgroundColor: generateColors(senderName.length),
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function plotTimeGraph(time) {
    var interval = ["12AM-1 AM", "1AM-2AM", "2AM-3AM", "3AM-4AM", "4AM-5AM", "5AM-6AM", "6AM-7AM", "7AM-8AM", "8AM-9AM", "9AM-10AM", "10AM-11AM", "11AM-12PM", "12PM-1PM", "1PM-2PM", "2PM-3PM", "3PM-4PM", "4PM-5PM", "5PM-6PM", "6PM-7PM", "7PM-8PM", "8PM-9PM", "9PM-10PM", "10PM-11PM", "11PM-12AM"];
    var i = time.indexOf(Math.max(...time));
    var timeText = document.getElementById("timeText");
    timeText.innerHTML = '<div class="high">' + time[i] + '</div>' + " Messages Were Sent Between " + interval[i];
    var ctx = document.getElementById("timeChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: interval,
            datasets: [{
                label: '# of Messages',
                data: time,
                backgroundColor: generateColors(24),
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function plotEmojiGraph(countEmoji) {
    var counter = [];
    var emoji = [];
    var count = [];
    for (var key in countEmoji) {
        if (countEmoji.hasOwnProperty(key)) {
            counter.push({ emoji: key, value: countEmoji[key] });
        }
    }
    counter.sort(function (a, b) {
        return b.value - a.value
    })
    if (counter.length > 5)
        counter = counter.splice(0, 5);
    counter.forEach(element => {
        emoji.push(element.emoji);
        count.push(element.value);
    });
    var i = count.indexOf(Math.max(...count));
    var emojiText = document.getElementById("emojiText");
    emojiText.innerHTML = '<div class="high">' + emoji[i] + '</div>' + " Was Sent " + count[i] + " Times";
    var ctx = document.getElementById("emojiChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: emoji,
            datasets: [{
                label: '# of Emoji',
                data: count,
                backgroundColor: generateColors(emoji.length),
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function plotDayGraph(date) {
    var day = [0, 0, 0, 0, 0, 0, 0];
    var dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    date.forEach(element => {
        day[moment(element, ["DD/MM/YYYY", "MM/DD/YYYY", "DD-MM-YYYY", "MM-DD-YYYY", "DD.MM.YYYY", "MM.DD.YYYY", "DD-MM-YY", "MM-DD-YY", "DD.MM.YY", "MM.DD.YY", "DD/MM/YY", "MM/DD/YY"]).format("e")]++;
    });

    var i = day.indexOf(Math.max(...day));
    var dayText = document.getElementById("dayText");
    dayText.innerHTML = '<div class="high">' + day[i] + '</div>' + " Messages Were Sent On " + dayName[i];

    var ctx = document.getElementById("dayChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dayName,
            datasets: [{
                label: '# of Messages',
                data: day,
                backgroundColor: generateColors(7),
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

}

function generateColors(n) {
    var bgColor = [];
    var r, g, b;
    for (let i = 0; i < Number(n); i++) {
        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        b = Math.floor(Math.random() * 255);
        bgColor.push('rgba(' + String(r) + ',' + String(g) + ',' + String(b) + ', 0.5)');
    }
    return bgColor;
}

function downloadURI(uri, name) {
    var link = document.createElement("a");
    var div = document.createElement("div");
    var text = document.createTextNode("Click On The Link If Download Doesn't Start Automatically");
    div.appendChild(text);
    link.download = name;
    link.href = uri;
    var textnode = document.createTextNode("Click Here");
    link.appendChild(textnode);
    document.getElementById("saveimg").appendChild(div);
    document.getElementById("saveimg").appendChild(link);
    link.dispatchEvent(new MouseEvent(`click`, { bubbles: true, cancelable: true, view: window }));
}

function printToFile() {
    document.getElementById("foot-cont").innerHTML = '<div class="flow-text" style="margin-top:30px">Generated Using WhatsApp Stat <div style="color:teal">www.ristri.com/whatsappstat</div></div>';
    html2canvas(document.getElementById("print-report"), { background: "white" }).then(function (canvas) {
        var myImage = canvas.toDataURL("image/png");
        downloadURI("data:" + myImage, "report.png");
    }
    );
    document.getElementById("foot-cont").style.display = "none";
}
