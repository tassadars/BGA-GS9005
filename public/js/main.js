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

  // $('form').submit(function () {
  //   socket.emit('chat message', $('#m').val());
  //   $('#m').val('');
  //   return false;
  // });

  // click button Connect / Disconnect
  document.getElementById("btnConnectPLC").onclick = function () {
    
    let tListBox = document.getElementById("inputGroupSelectPLC");

    if (this.getElementsByTagName("label")[0].innerHTML == "Connect") {
      // click to connect
      this.getElementsByTagName("label")[0].innerHTML = "Disconnect";

      tListBox.setAttribute("disabled", true);
      tListBox.className += " connected";       
      tListBox.nextElementSibling.firstElementChild.className += " connected";

      bDoOneTimeI = false;
      bDoOneTimeQ = false;
      bDoOneTimeM = false;

      socket.emit('selectedPLCByClient', $('#inputGroupSelectPLC').val());
    }
    else {
      // click to disconnect
      this.getElementsByTagName("label")[0].innerHTML = "Connect";

      tListBox.removeAttribute("disabled");
      tListBox.classList.remove("connected");       
      tListBox.nextElementSibling.firstElementChild.classList.remove("connected");    
      
      socket.emit('selectedPLCByClient', "PLC disconnect");
    }
  }

  function insertIndicatorTags(plcData, plcDataType, fatherTag, bDoOneTime) {
    var tDivLine = document.createElement('div');
    var tDivCaption = document.createElement('div');
    var tP = document.createElement('p');

    var tDiv = document.createElement('div');
    var tPbit = document.createElement('p');

    var tBr = document.createElement('br');

    tDivLine.className = "inline";
    tDivLine.style.display = "none";

    tDivCaption.className = "indicatorCaption inline";
    tP.className = "tagMark";
    tDiv.className = "indicator inline " + plcDataType;
    tPbit.className = "bitMark";
    tBr.className = "clearBoth";

    tDivCaption.appendChild(tP);
    tDiv.appendChild(tPbit).cloneNode(true);

    tDivLine.appendChild(tDivCaption);
    // set text captions for bits from 0 to 7
    for (var bit = 0; bit <= 7; bit++) {
      tDiv.lastChild.innerText = bit;
      tDivLine.appendChild(tDiv.cloneNode(true));
    }

    // clean fatherTag from child nodes
    while (fatherTag.hasChildNodes()) {
      fatherTag.removeChild(fatherTag.firstChild);
    }

    // process all received data from PLC and display it
    for (var currentByte in plcData[plcDataType]) {
      tP.innerText = currentByte;
      for (var bit = 0; bit <= 7; bit++) {
        // start from index 1, index 0 is under tDivCaption
        tDivLine.childNodes[bit + 1].setAttribute("state-color", plcData[plcDataType][currentByte][bit]);
      }

      fatherTag.appendChild(tDivLine.cloneNode(true));

      if (parseInt(plcData[plcDataType][currentByte].join('')) > 0) {
        fatherTag.lastChild.style.display = "block";
      }
      //fatherTag.appendChild(tBr.cloneNode(true));
    }
    return bDoOneTime = true;
  }

  // get data from server of PLC list to connect 
  socket.on('configData', function (configData) {
    var tListBox = document.getElementById("inputGroupSelectPLC");

    // list already filled
    if (tListBox.childElementCount > 1) {      
      console.log("Debug: list box already filled by " + tListBox.childElementCount + " rows");
      return 0;
    }


    var tOption = document.createElement("option");

    
    for (var currentPLC in configData['plcs']) {
      tOption.text = configData['plcs'][currentPLC].name;
      tOption.value = configData['plcs'][currentPLC].ip;
      //tOption.setAttribute("rack", configData['plcs'][currentPLC].rack);

      tListBox.options.add(tOption.cloneNode(true));
    }
    // example of data
    // configData["plcs"].push({ name: "BGA_GS9031", ip: "192.168.0.70", slot:"0", rack:"4", room: "II/139" });

    // check if plc is connected
    if (configData["status"] == "PLC disconnect") {
      //console.log("disabled false");
    } else {
      tListBox.setAttribute("disabled", true);
      tListBox.className += " connected"; 
      tListBox.nextElementSibling.firstElementChild.className += " connected";

      for (let option of tListBox.options) {
        // if ip address of plc in run the same as in list
        if (option.value == configData["status"]) {
          option.selected = true;
          document.getElementById("btnTxtConnectPLC").innerHTML = "Disconnect";
        }
      }
      //console.log("disabled true");
    }

    console.log("Client got configuration data");
  });

  socket.on('readDataFromPLC', function (plcData) {
    //document.getElementById("tickTac").innerHTML = plcData.I20[1];
    //document.getElementById("tickTac").setAttribute("state-color", plcData.I20[1]);

    if (plcData["qualitySignal"]) {

      //console.log('quality good');
  
      if (!bDoOneTimeI) { bDoOneTimeI = insertIndicatorTags(plcData, "inputs", allInputTags, bDoOneTimeI); }
      if (!bDoOneTimeQ) { bDoOneTimeQ = insertIndicatorTags(plcData, "outputs", allOutputTags, bDoOneTimeQ); }
      if (!bDoOneTimeM) { bDoOneTimeM = insertIndicatorTags(plcData, "merkers", allMerkerTags, bDoOneTimeM); }

      refreshIndicators(indicatorsI, "inputs");
      refreshIndicators(indicatorsQ, "outputs");
      refreshIndicators(indicatorsM, "merkers");
    }

    function refreshIndicators(arrList, sDataType) {
      var index = 0;

      for (var currentByte in plcData[sDataType]) {

        for (var bit = 0; bit <= 7; bit++) {
          arrList[index].setAttribute("state-color", plcData[sDataType][currentByte][bit]);
          index++;
        }

        // show indicator line if there at least some bit was set to 1
        if (parseInt(plcData[sDataType][currentByte].join('')) > 0) {
          // index was incremented to next indicator line, get previous element as -1
          arrList[index - 1].parentElement.style.display = "block";
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