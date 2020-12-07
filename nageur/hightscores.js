document.addEventListener('DOMContentLoaded', () => {

    let container = document.getElementById('container');
    let scoresArray = document.getElementById('scoresArray');

    let scoresData = [];
    let order = 1;
    scoresData = JSON.parse(localStorage.getItem("higth_scores"));

    container.classList.add("bg-primary")

    displayHightScores(scoresData);

    function displayHightScores(x) {

        let hightScoresFragment = document.createDocumentFragment();

        let tabScores = document.createElement("table");

        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');

        let thName = document.createElement('th');
        let thPoints = document.createElement('th');
        let thOrder = document.createElement('th');

        thName.textContent = "Nom";
        thPoints.textContent = "Pts";
        thOrder.textContent = "#";

        scoresArray.classList.add("container");
        scoresArray.classList.add("d-flex");
        scoresArray.classList.add("justify-content-center");
        scoresArray.classList.add("align-items-center");
        scoresArray.classList.add("h-75");

        tabScores.classList.add("table")
        tabScores.classList.add("w-50");
        tabScores.classList.add("table-info");

        thName.classList.add("text-center");
        thPoints.classList.add("text-center");
        thOrder.classList.add("text-center");

        thead.classList.add("thead-light");

        thead.appendChild(thOrder);
        thead.appendChild(thName);
        thead.appendChild(thPoints);

        tabScores.appendChild(thead);


        x.forEach(data => {
            let tr = document.createElement('tr');
            let tdPlayerName = document.createElement('td');
            let tdPlayerScore = document.createElement('td');
            let tdPlayerOrder = document.createElement('td');

            tdPlayerName.textContent = data.name;
            tdPlayerScore.textContent = data.score;
            tdPlayerOrder.textContent = order;

            tr.appendChild(tdPlayerOrder);
            tr.appendChild(tdPlayerName);
            tr.appendChild(tdPlayerScore);

            tdPlayerName.classList.add("text-center");
            tdPlayerScore.classList.add("text-center");
            tdPlayerOrder.classList.add("text-center");
            tdPlayerOrder.classList.add("w-25");

            order++
            hightScoresFragment.appendChild(tr);
        })

        tbody.appendChild(hightScoresFragment);
        tabScores.appendChild(tbody);
        scoresArray.appendChild(tabScores);

    }

})