const readline = require("readline");

function permute(arr) {
    if (arr.length <= 1) return [arr];
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        const rest = arr.slice(0, i).concat(arr.slice(i + 1));
        for (const p of permute(rest)) result.push([arr[i], ...p]);
    }
    return result;
}

function findFormula(numbers, target) {
    const ops = ['+', '-', '*'];
    let found = null;

    function helper(expr, remaining) {
        if (found) return;
        if (remaining.length === 0) {
            try {
                const val = Function(`return ${expr}`)();
                if (val === target) found = expr;
            } catch { }
            return;
        }

        for (const op of ops) {
            helper(`${expr}${op}${remaining[0]}`, remaining.slice(1));
            helper(`(${expr}${op}${remaining[0]})`, remaining.slice(1));
            if (found) return;
        }
    }

    for (const perm of permute(numbers)) {
        helper(perm[0].toString(), perm.slice(1));
        if (found) break;
    }

    return found ? found : "Tidak ditemukan kombinasi yang cocok";
}

// --- Input user CLI ---
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Masukkan daftar angka (pisahkan dengan koma, contoh: 1,4,5,6): ", (inputAngka) => {
    rl.question("Masukkan target angka: ", (targetInput) => {
        const angkaArray = inputAngka.split(",").map(a => parseInt(a.trim()));
        const target = parseInt(targetInput);

        const hasil = findFormula(angkaArray, target);

        console.log(`\nRumus untuk mencapai ${target}:`);
        console.log(hasil);

        rl.close();
    });
});
