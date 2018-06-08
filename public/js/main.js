$(function () {
  var socket = io.connect();
  var indicatorsI = document.getElementsByClassName("inputs");
  var indicatorsQ = document.getElementsByClassName("outputs");
  var indicatorsM = document.getElementsByClassName("merkers");

  var allInputTags = document.getElementById("all-inputs");
  var allOutputTags = document.getElementById("all-outputs");
  var allMerkerTags = document.getElementById("all-merkers");

  var bDoOneTimeI = false;
  var bDoOneTimeQ = false;
  var bDoOneTimeM = false;

  $('form').submit(function () {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  function insertIndicatorTags(plcData, plcDataType, fatherTag, bDoOneTime) {
    var tDivCaption = document.createElement('div');
    var tP = document.createElement('p');

    var tDiv = document.createElement('div');
    var tPbit = document.createElement('p');

    var tBr = document.createElement('br');

    tDivCaption.className = "indicatorCaption inline";
    tP.className = "tagMark";
    tDiv.className = "indicator inline " + plcDataType;
    tPbit.className = "bitMark";
    tBr.className = "clearBoth";

    tDivCaption.appendChild(tP);
    tDiv.appendChild(tPbit);

    for (var currentByte in plcData[plcDataType]) {
      tP.innerText = currentByte;
      fatherTag.appendChild(tDivCaption.cloneNode(true));

      for (var bit = 0; bit <= 7; bit++) {
        tDiv.setAttribute("state-color", plcData[plcDataType][currentByte][bit]);
        tPbit.innerHTML = bit;
        fatherTag.appendChild(tDiv.cloneNode(true));
      }
      fatherTag.appendChild(tBr.cloneNode(true));
    }
    return bDoOneTime = true;
  }

  socket.on('readDataFromPLC', function (plcData) {
    //document.getElementById("tickTac").innerHTML = plcData.I20[1];
    //document.getElementById("tickTac").setAttribute("state-color", plcData.I20[1]);

    if (!bDoOneTimeI) { bDoOneTimeI = insertIndicatorTags(plcData, "inputs", allInputTags, bDoOneTimeI); }
    if (!bDoOneTimeQ) { bDoOneTimeQ = insertIndicatorTags(plcData, "outputs", allOutputTags, bDoOneTimeQ); }
    if (!bDoOneTimeM) { bDoOneTimeM = insertIndicatorTags(plcData, "merkers", allMerkerTags, bDoOneTimeM); }

    refreshIndicators(indicatorsI, "inputs");
    refreshIndicators(indicatorsQ, "outputs");
    refreshIndicators(indicatorsM, "merkers");

    function refreshIndicators(arrList, sDataType) {
      var index = 0;
      for (var currentByte in plcData[sDataType]) {
        for (var bit = 0; bit <= 7; bit++) {
          arrList[index].setAttribute("state-color", plcData[sDataType][currentByte][bit]);
          index++;
        }
      };
    }

    // change color of html tag
    //=================================================================================
    // for information (deprecated solution)
    // const stateColorText = {
    //   '1': 'teal-text',
    //   '2': 'green-text',
    //   '3': 'red-text',
    //   '4': 'yellow-text',
    //   '5': 'brown-text'
    // };
    //=================================================================================
  });

});