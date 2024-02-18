$(document).ready(function () {
    $('.ui.dropdown').dropdown();
    $('.menu .item')
        .tab()
        ;
});

let players = [];

document.addEventListener('DOMContentLoaded', function () {
  
    document.querySelector('#recordSubmitButton').addEventListener('click', function (e) {
        e.preventDefault(); 

        var attackerValue = document.querySelector('#attacker input[type="hidden"]').value;
        var attackedValue = document.querySelector('#attacked input[type="hidden"]').value;
        var emotionalResponseValue = document.querySelector('#emotionalResponse input[type="hidden"]').value;

        function getCurrentDateTime() {
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        }

        var postData = {
            players: players,
            attacker: attackerValue,
            attacked: attackedValue,
            emotionalResponse: emotionalResponseValue,
            date: getCurrentDateTime()
        };

        var data = JSON.stringify({
            "dataSource": "<mongo_dataSource>",
            "database": "<mongo_database>",
            "collection": "<mongo_collection>",
            "document": {
                postData
            }
        });
        fetch('<database_url>', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': '<api_key>',
            },
            body: data
        })
            .then(response => response.json())
            .then(data => {
                $('#attackReport div.field').addClass('disabled');
                const message = '<div class="ui green small fluid message"><p><i class="thumbs up icon"></i> Submitted Successfully</p></div>';
                $('#attackReport').append(message);
            })
            .catch((error) => {
                $('#attackReport div.field').addClass('disabled');
                const message = '<div class="ui red small fluid message"><p><i class="thumbs down icon"></i> Submit Failed</p></div>';
                $('#attackReport').append(message);
                console.error('Error:', error);
            });
    });
    document.querySelector('a.item[data-tab="statsTab"]').addEventListener('click', function (e) {

        var data = JSON.stringify({
            "dataSource": "<mongo_dataSource>",
            "database": "<mongo_database>",
            "collection": "<mongo_collection>"
        });
        fetch('<database_URL>', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': '<api_key>',
            },
            body: data
        })
            .then(response => response.json())
            .then(data => {
                function countOccurrences(documents, key) {
                    return documents.reduce((acc, { postData }) => {
                        const value = postData[key];
                        acc[value] = (acc[value] || 0) + 1;
                        return acc;
                    }, {});
                }

                function findMostCommon(occurrences) {
                    let maxCount = 0;
                    let candidates = [];
                
                    Object.entries(occurrences).forEach(([key, count]) => {
                        if (count > maxCount) {
                            maxCount = count;
                            candidates = [key];
                        } else if (count === maxCount) {
                            candidates.push(key); 
                        }
                    });
                
                    if (candidates.length > 1) {
                        return ["Tie for who", maxCount]; 
                    } else {
                        return [candidates[0] || "", maxCount]; 
                    }
                }
                
                const attackerOccurrences = countOccurrences(data.documents, 'attacker');
                const attackedOccurrences = countOccurrences(data.documents, 'attacked');
                const emotionalResponseOccurrences = countOccurrences(data.documents, 'emotionalResponse');

                const mostCommonAttacker = findMostCommon(attackerOccurrences);
                const mostCommonAttacked = findMostCommon(attackedOccurrences);
                const mostCommonEmotionalResponse = findMostCommon(emotionalResponseOccurrences);

                $('#attackedStat div.value').text(mostCommonAttacked[0] === "" ? "N/A" : mostCommonAttacked[0]);
                $('#attackerStat div.value').text(mostCommonAttacker[0] === "" ? "N/A" : mostCommonAttacker[0]);
                $('#emotionalStat div.value').text(mostCommonEmotionalResponse[0] === "" ? "N/A" : mostCommonEmotionalResponse[0]);

                const colors = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey', 'black'];

                function generateCards(documents) {
                    const summary = documents.reduce((acc, { postData }) => {
                        const playersInGame = postData['players'] || []; e
                
                        playersInGame.forEach(playerName => {
                            const player = playerName.toLowerCase(); 
                            if (player) { 

                                if (!acc[player]) acc[player] = { attackedFirst: 0, wasAttacked: 0, totalGames: 1, observed: 0 };
                                else acc[player].totalGames += 1; 
                

                                if ((postData['observers'] || []).map(name => name.toLowerCase()).includes(player)) {
                                    acc[player].observed += 1; 
                                }
                            }
                        });
                
                        if (postData['attacker']) acc[postData['attacker'].toLowerCase()].attackedFirst += 1;
                        if (postData['attacked']) acc[postData['attacked'].toLowerCase()].wasAttacked += 1;
                
                        return acc;
                    }, {});
                
                    return Object.entries(summary).map(([name, counts]) => {
                        const color = colors[Math.floor(Math.random() * colors.length)]; 
                        return `<div class="ui raised ${color} card">
                              <div class="content">
                                <div class="header">${name}</div>
                                <div class="description">
                                  <p>Attacked first ${counts.attackedFirst} times, was attacked ${counts.wasAttacked} times${counts.observed ? ', observed ' + counts.observed + ' times' : ''}</p>
                                </div>
                              </div>
                              <div class="extra content">
                                ${counts.totalGames} Total Games
                              </div>
                            </div>`;
                    }).join('');
                }
                
                const cardsHtml = generateCards(data.documents);

                $('#cardsContainer').html(cardsHtml); // Adjust this to where you want to insert the cards

                $('#statsContainer').removeClass('customHidden');

            })
            .catch((error) => {
                const message = '<div class="ui red small fluid message"><p><i class="thumbs down icon"></i> Submit Failed</p></div>';
                $('#statsContainer').append(message);
                console.error('Error:', error);
            });
    });

    var dropdowns = document.querySelectorAll('.ui.dropdown input[type="hidden"]');
    var submitButton = document.querySelector('#recordSubmitButton');

    function checkDropdownsAndToggleSubmit() {
        let allSelected = true;
        dropdowns.forEach(function (dropdown) {
            if (dropdown.value === '') {
                allSelected = false;
            }
        });

        if (allSelected) {
            submitButton.classList.remove('disabled');
        } else {
            if (!submitButton.classList.contains('disabled')) {
                submitButton.classList.add('disabled');
            }
        }
    }

    dropdowns.forEach(function (dropdown) {
        dropdown.addEventListener('change', checkDropdownsAndToggleSubmit);
    });

    checkDropdownsAndToggleSubmit();

});

document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('nameSubmitButton');
    const actionButton = document.getElementById('actionButton');
    const nameSegment = document.getElementById('nameSegment');
    const nameInput = document.querySelector('input[name="name"]');
    const nameList = document.getElementById('nameList');
    const recordSegment = document.getElementById('recordSegment');
    const colors = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey', 'black'];
    const usedColors = new Set(); // Use a Set to track used colors

    const updateActionButtonState = () => {
        const itemCount = nameList.querySelectorAll('.label').length;
        actionButton.classList.toggle('disabled', itemCount < 2);
    };

    nameInput.addEventListener('input', () => {
        const name = nameInput.value.trim();
        submitButton.classList.toggle('disabled', !name);
    });

    submitButton.addEventListener('click', () => {
        const name = nameInput.value.trim();
        if (name && !submitButton.classList.contains('disabled')) {
            const availableColors = colors.filter(color => !usedColors.has(color));
            if (availableColors.length === 0) {
                usedColors.clear(); // Clear used colors if all have been used
                availableColors.push(...colors); // Repopulate availableColors
            }
            const color = availableColors[Math.floor(Math.random() * availableColors.length)];
            usedColors.add(color); // Add selected color to usedColors

            const newItem = document.createElement('a');
            newItem.className = `ui ${color} label`;
            newItem.innerHTML = `<i class="user icon"></i> ${name} <i class="delete icon"></i>`;
            nameList.appendChild(newItem);
            const placeholderMessage = document.querySelector('#nameList div.placeholder');
            placeholderMessage.classList.add('customHidden');

            newItem.querySelector('.delete.icon').addEventListener('click', () => {
                newItem.remove();
                updateActionButtonState();
                usedColors.delete(color); // Remove the color from usedColors upon deletion
            });

            nameInput.value = '';
            submitButton.classList.add('disabled');
            updateActionButtonState();
        }
    });

    // Function to extract names and populate dropdowns
    const populateDropdowns = () => {
        // Find the list of names by selecting all labels within the #nameList div
        const nameElements = document.querySelectorAll('#nameList a.label');

        // Extract the text content (name) from each label, avoiding duplicates
        const names = [...new Set(Array.from(nameElements).map(label => label.textContent.trim()))];
        players = [...new Set([...players, ...names])];

        // Find dropdown menus for attacker and attacked
        const attackerDropdownMenu = document.querySelector('#attacker .menu');
        const attackedDropdownMenu = document.querySelector('#attacked .menu');

        // Clear existing items in the dropdowns
        attackerDropdownMenu.innerHTML = '';
        attackedDropdownMenu.innerHTML = '';

        // Populate the dropdown menus with names
        names.forEach(name => {
            // Create new div elements for each name
            const attackerItem = document.createElement('div');
            attackerItem.className = 'item';
            attackerItem.textContent = name;

            const attackedItem = attackerItem.cloneNode(true); // Clone for attacked dropdown

            // Append the new elements to the dropdown menus
            attackerDropdownMenu.appendChild(attackerItem);
            attackedDropdownMenu.appendChild(attackedItem);
        });
    };

    actionButton.addEventListener('click', () => {
        if (!actionButton.classList.contains('disabled')) {
            populateDropdowns();
            recordSegment.classList.remove('customHidden');
            nameSegment.classList.add('customHidden');
        }
    });

    updateActionButtonState();
});
