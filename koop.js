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
    }
    bestelling.forEach(item => {
      this.items.push(item);
    });
    return bestelling;
  },

  verwijderItem: function(ean) {
    this.items.forEach((item, index) => {
      if (item.ean == ean) {
        this.items.splice(index, 1);
        ean = 4;
      }
    });

    localStorage.setItem("KoopDeAuto", JSON.stringify(this.items));
    if (this.items.length > 0) {
      document.querySelector(
        ".winkelwagen__aantal"
      ).innerHTML = this.items.length;
    } else {
      document.querySelector(".winkelwagen__aantal").innerHTML = "";
    }
    this.uitvoeren();
  },

  totaalPrijsBerekenen: function() {
    let totaal = 0;
    this.items.forEach(auto => {
      totaal += auto.prijs;
    });
    return totaal;
  },

  uitvoeren: function() {
    document.getElementById("bestelling").innerHTML = "";
    this.items.forEach(auto => {
      let sectie = document.createElement("section");
      sectie.className = "KoopAuto";

      let afbeelding = document.createElement("img");
      afbeelding.className = "KoopAutoFoto";
      afbeelding.setAttribute("src", auto.cover);
      afbeelding.setAttribute("alt", keerTekstOm(auto.merk));

      let merk = document.createElement("h3");
      merk.className = "KoopAutoModel";
      merk.textContent = keerTekstOm(auto.merk);

      let prijs = document.createElement("div");
      prijs.className = "KoopAutoPrijs";
      prijs.textContent = auto.prijs.toLocaleString("nl-NL", {
        currency: "EUR",
        style: "currency"
      });

      let verwijder = document.createElement("div");
      verwijder.className = "KoopAutoDelete";
      verwijder.addEventListener("click", () => {
        this.verwijderItem(auto.ean);
      });

      sectie.appendChild(afbeelding);
      sectie.appendChild(merk);
      sectie.appendChild(prijs);
      sectie.appendChild(verwijder);
      document.getElementById("bestelling").appendChild(sectie);
    });

    let sectie = document.createElement("section");
    sectie.className = "KoopAuto";

    let totaalTekst = document.createElement("div");
    totaalTekst.className = "KoopAutoTekst";
    totaalTekst.innerHTML = "Totaal: ";

    let totaalPrijs = document.createElement("div");
    totaalPrijs.className = "KoopAutoPrijs";
    totaalPrijs.textContent = this.totaalPrijsBerekenen().toLocaleString(
      "nl-NL",
      {
        currency: "EUR",
        style: "currency"
      }
    );

    sectie.appendChild(totaalTekst);
    sectie.appendChild(totaalPrijs);
    document.getElementById("bestelling").appendChild(sectie);

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
winkelwagen.uitvoeren();
