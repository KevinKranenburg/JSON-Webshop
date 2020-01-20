let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    sorteerauto.data = JSON.parse(this.responseText);
    sorteerauto.voegJSDatumtoe();

    sorteerauto.data.forEach(auto => {
      auto.merkKap = auto.merk.toUpperCase();

      auto.sorteerModel = auto.model[0];
    });
    sorteerauto.sorteren();
  }
};
xmlhttp.open("GET", "autos.json", true);
xmlhttp.send();

const TabelKop = arr => {
  let kop = "<table class='AutoBlok'><tr>";
  arr.forEach(item => {
    kop += "<th>" + item + "</th>";
  });
  kop += "</tr>";
  return kop;
};

const opsomming = array => {
  let string = "";
  for (let i = 0; i < array.length; i++) {
    switch (i) {
      case array.length - 1:
        string += array[i];
        break;
      case array.length - 2:
        string += array[i] + " en ";
        break;
      default:
        string += array[i] + ", ";
    }
  }
  return string;
};

const geefMaandNummer = maand => {
  let nummer;
  switch (maand) {
    case "januari":
      nummer = 0;
      break;
    case "februari":
      nummer = 1;
      break;
    case "maart":
      nummer = 2;
      break;
    case "april":
      nummer = 3;
      break;
    case "mei":
      nummer = 4;
      break;
    case "juni":
      nummer = 5;
      break;
    case "juli":
      nummer = 6;
      break;
    case "augustus":
      nummer = 7;
      break;
    case "september":
      nummer = 8;
      break;
    case "oktober":
      nummer = 9;
      break;
    case "november":
      nummer = 10;
      break;
    case "december":
      nummer = 11;
      break;

    default:
      nummer = 0;
      break;
  }
  return nummer;
};

const VoegJSDatum = maandJaar => {
  let mjArray = maandJaar.split(" ");
  let datum = new Date(mjArray[1], geefMaandNummer(mjArray[0]));
  return datum;
};

const keerTekstOm = string => {
  if (string.indexOf(",") != -1) {
    let array = string.split(",");
    string = array[1] + " " + array[0];
  }
  return string;
};

let winkelwagen = {
  items: [],

  haalProductenOp: function() {
    let bestelling;
    if (localStorage.getItem("KoopDeAuto") == null) {
      bestelling = [];
    } else {
      bestelling = JSON.parse(localStorage.getItem("KoopDeAuto"));
      bestelling.forEach(item => {
        this.items.push(item);
      });
      this.uitvoeren();
    }
    return bestelling;
  },
  toevoegen: function(el) {
    this.items = this.haalProductenOp();
    this.items.push(el);
    localStorage.setItem("KoopDeAuto", JSON.stringify(this.items));
    this.uitvoeren();
  },

  uitvoeren: function() {
    if (this.items.length > 0) {
      document.querySelector(
        ".winkelwagen__aantal"
      ).innerHTML = this.items.length;
    } else {
      document.querySelector(".winkelwagen__aantal").innerHTML = "";
    }
  }
};

winkelwagen.haalProductenOp();

let sorteerauto = {
  data: "",

  kenmerk: "merkKap",

  lopend: 1,

  voegJSDatumtoe: function() {
    this.data.forEach(item => {
      item.Datums = VoegJSDatum(item.modeljaar);
    });
  },

  sorteren: function() {
    this.data.sort((a, b) =>
      a[this.kenmerk] > b[this.kenmerk] ? 1 * this.lopend : -1 * this.lopend
    );
    this.uitvoeren(this.data);
  },

  uitvoeren: function(data) {
    document.getElementById("uitvoer").innerHTML = "";
    data.forEach(auto => {
      let sectie = document.createElement("section");
      sectie.className = "AutoBlok";

      let main = document.createElement("main");
      main.className = "AutoSelectieMaster";

      let afbeelding = document.createElement("img");
      afbeelding.className = "AutoSelectie";
      afbeelding.setAttribute("src", auto.cover);
      afbeelding.setAttribute("alt", keerTekstOm(auto.merk));

      let merk = document.createElement("h3");
      merk.className = "merk";
      merk.textContent = keerTekstOm(auto.merk);

      let model = document.createElement("p");
      model.className = "AutoBlok__model";

      auto.model[0] = keerTekstOm(auto.model[0]);

      model.textContent = opsomming(auto.model);

      let overig = document.createElement("p");
      overig.className = "AutoSelectieMaster2";
      overig.textContent =
        "Model jaar: " +
        auto.modeljaar +
        " | Land van herkomst: " +
        auto.land +
        " | Vermogen: " +
        auto.vermogen;

      let prijs = document.createElement("div");
      prijs.className = "AutoSelectiePrijs";
      prijs.textContent = auto.prijs.toLocaleString("nl-NL", {
        currency: "EUR",
        style: "currency"
      });

      let button = document.createElement("button");
      button.className = "KoopButton";
      button.innerHTML = "Voeg toe aan<br>winkelwagen";
      button.addEventListener("click", () => {
        winkelwagen.toevoegen(auto);
      });

      sectie.appendChild(afbeelding);
      main.appendChild(merk);
      main.appendChild(model);
      main.appendChild(overig);
      sectie.appendChild(main);
      prijs.appendChild(button);
      sectie.appendChild(prijs);
      document.getElementById("uitvoer").appendChild(sectie);
    });
  }
};

let kenmerk = document
  .getElementById("kenmerk")
  .addEventListener("change", e => {
    sorteerauto.kenmerk = e.target.value;
    sorteerauto.sorteren();
  });

document.getElementsByName("lopend").forEach(item => {
  item.addEventListener("click", e => {
    sorteerauto.lopend = parseInt(e.target.value);
    sorteerauto.sorteren();
  });
});
