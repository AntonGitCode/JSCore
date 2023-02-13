function debounce(callback, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  };
}

class View {
  constructor() {
    this.app = document.getElementById("app");
    this.searchLine = this.createElement("div", "search-line");
    this.searchInput = this.createElement("input", "search-input");
    this.searchCounter = this.createElement("span", "counter");

    this.searchLine.append(this.searchInput);
    this.searchLine.append(this.searchCounter);

    this.repsWrapper = this.createElement("div", "reps-wrapper");
    this.repsList = this.createElement("ul", "reps");
    this.repsWrapper.append(this.repsList);

    this.main = this.createElement("div", "main");
    this.main.append(this.repsWrapper);

    this.app.append(this.searchLine);
    this.app.append(this.main);
  }

  createElement(elementTag, elementClass) {
    let element = document.createElement(elementTag);
    if (elementClass) {
      element.classList.add(elementClass);
    }
    return element;
  }

  deleteElement(el) {
    el.remove();
  }

  createReps(item) {
    const itemRep = this.createElement("li", "rep-prev");
    itemRep.innerHTML = item.name;
    this.repsList.append(itemRep);

    itemRep.addEventListener("click", () => {
      this.searchInput.value = "";
      const selectedRepsWrapper = this.createElement("div", "card");
      const selectedRepList = this.createElement("div", "reps-list");

      const itemRep = this.createElement("div");
      itemRep.innerHTML = `Name: ${item.name}`;
      selectedRepList.append(itemRep);

      const itemRep2 = this.createElement("div");
      itemRep2.innerHTML = `Owner: ${item.owner["login"]}`;
      selectedRepList.append(itemRep2);

      const itemRep3 = this.createElement("div");
      itemRep3.innerHTML = `Stars: ${item.stargazers_count}`;
      selectedRepList.append(itemRep3);

      const escape = this.createElement("div", "escape");
      escape.innerHTML = `<img src='cancel-btn.svg' class='cross-line'>`;

      selectedRepsWrapper.append(selectedRepList);
      selectedRepsWrapper.append(escape);

      this.main.append(selectedRepsWrapper);

      escape.addEventListener(
        "click",
        this.deleteElement.bind(this, selectedRepsWrapper)
      );
    });
  }
}

class Search {
  constructor(view) {
    this.view = view;
    this.view.searchInput.addEventListener(
      "keyup",
      debounce(this.searchReps.bind(this), 450)
    );
  }

  async searchReps() {
    if (
      this.view.searchInput.value &&
      this.view.searchInput.value.charAt(0) !== " "
    ) {
      return await fetch(
        `https://api.github.com/search/repositories?q=${this.view.searchInput.value}`
      ).then((res) => {
        this.clearRepsList();
        res.json().then((res) => {
          let count = 0;
          do {
            this.view.createReps(res.items[count]);
          } while (++count < 5);
        });
      });
    } else {
      this.clearRepsList();
      this.view.searchInput.value = "";
    }
  }

  clearRepsList() {
    this.view.repsList.innerHTML = "";
  }
}

document.body.style.backgroundColor = "#C4C4C4";
new Search(new View());
