const readline  = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({
    input: fs.createReadStream('./wordle.txt'),
    output: null,
    console: false
});
const input = require('./input.json');


readInterface.on('line', (line) => {
    for (const c of line) {
        map[c.charCodeAt(0) - offset].add(line);
    }
    everything.add(line);
});
readInterface.on('close', () => {
});

function solve (input){
    let sets = [];
    for (const {key, exists} of input) {
        if (exists) {
            sets.push(map[key.charCodeAt(0) - offset]);
        }
    }
    let filtered = sets[0];
    if (!filtered) {
        filtered = everything;
    }
    for (let i = 1; i < sets.length; i++) {
        filtered = new Set([...filtered].filter(word => sets[i].has(word)));
    }
    for (const {key, exists, positions} of input) {
        for (const elem of filtered.keys()) {
            if (!exists && elem.includes(key)) {
                filtered.delete(elem);
            }
            if (!exists) continue;
            for (let i = 0; i < positions.length; i++) {
                if (positions[i] > 0 && elem.charAt(i) != key) {
                    filtered.delete(elem);
                }
                if (positions[i] < 0 && elem.charAt(i) == key) {
                    filtered.delete(elem);
                }
            }
            
        }
    }
    // console.log("filtered down to :",filtered.size, "words");

    let frequencies = new Array(26).fill(0).map(() => 0);
    let seen = new Set();
    for (const {key} of input) {
        seen.add(key);
    }
    for (const possibility of filtered) {
        for (const letter of possibility) {
            if (seen.has(letter) && possibility.lastIndexOf(letter) == possibility.indexOf(letter)) continue;
            frequencies[letter.charCodeAt(0) - offset] += 1;
        }
    }
    let max = 0;
    let second = 0;
    let third = 0;
    let fourth = 0;
    let fifth = 0;
    for (const frequency of frequencies) {
        if (frequency > max) {
            second = max;
            max = frequency;
        } else if (frequency > second && frequency < max) {
            third = second;
            second = frequency;
        } else if (frequency > third && frequency < second) {
            fourth = third;
            third = frequency;
        }
        else if (frequency > fourth && frequency < third) {
            fifth = fourth;
            fourth =  frequency;
        }
        else if (frequency > fifth && frequency < fourth) {
            fifth = frequency;
        }
    }
    if (second == 0) second = max;
    if (third == 0) third = second;
    if (fourth ==  0) fourth = third;
    if (fifth == 0) fifth = fourth;
    const frequentletters = new Set();
    if (max < 1000) {
        fifth = third;
    }
    if (max < 10) {
        fifth = second;
    }
    for (let i = 0; i < frequencies.length; i++) {
        if (frequencies[i] >= fifth) {
            frequentletters.add(String.fromCharCode(i + offset));
        }
    }
    console.log("most frequent letters remaining", frequentletters)
    const recommended = new Map();
    for (const word of filtered) {
        for (const c of frequentletters.keys()) {
            if (word.includes(c)) {
                recommended.set(word, (recommended.get(word) || 0) + 1)
            }
        }
    }
    return [...recommended].sort((a,b) => b[1]-a[1]);
}