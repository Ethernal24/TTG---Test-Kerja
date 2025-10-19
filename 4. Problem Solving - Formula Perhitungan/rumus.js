const readline = require("readline");

// Fungsi untuk menghasilkan semua urutan angka (permutasi)
function buatSemuaUrutan(arr) {
    if (arr.length === 1) return [arr];
    const hasil = [];

    for (let i = 0; i < arr.length; i++) {
        const angkaSekarang = arr[i];
        const sisa = arr.slice(0, i).concat(arr.slice(i + 1));
        const kombinasiLain = buatSemuaUrutan(sisa);
        kombinasiLain.forEach(k => hasil.push([angkaSekarang, ...k]));
    }

    return hasil;
}

// Fungsi utama untuk mencari rumus
function cariRumusYangCocok(daftarAngka, target) {
    const operatorTersedia = ['+', '-', '*'];
    let hasilDitemukan = null;

    // Fungsi rekursif untuk coba semua kombinasi operator
    function eksplorasi(expr, sisa) {
        if (hasilDitemukan) return;

        if (sisa.length === 0) {
            try {
                const nilai = Function(`return ${expr}`)();
                if (nilai === target) {
                    hasilDitemukan = expr;
                }
            } catch (e) {

            }
            return;
        }

        // coba semua operator antar angka
        for (const op of operatorTersedia) {
            eksplorasi(`${expr}${op}${sisa[0]}`, sisa.slice(1));
            eksplorasi(`(${expr}${op}${sisa[0]})`, sisa.slice(1));
            if (hasilDitemukan) return;
        }
    }


    const semuaUrutan = buatSemuaUrutan(daftarAngka);
    for (let i = 0; i < semuaUrutan.length; i++) {
        const urutan = semuaUrutan[i];
        eksplorasi(urutan[0].toString(), urutan.slice(1));
        if (hasilDitemukan) break;
    }

    return hasilDitemukan
        ? hasilDitemukan
        : "Tidak ditemukan kombinasi operator dan urutan angka yang menghasilkan target tersebut.";
}

// input dari terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("=== Program Pencari Rumus ===");
console.log("Masukkan daftar angka dan target untuk menemukan kombinasi operator yang cocok.\n");

rl.question("Masukkan daftar angka (pisahkan dengan koma, contoh: 1,4,5,6): ", (inputAngka) => {
    rl.question("Masukkan target angka: ", (targetInput) => {
        const daftarAngka = inputAngka
            .split(",")
            .map(a => parseInt(a.trim()))
            .filter(a => !isNaN(a));

        const target = parseInt(targetInput);

        if (daftarAngka.length === 0 || isNaN(target)) {
            console.log("\nInput tidak valid. Pastikan angka dan target diisi dengan benar.");
            rl.close();
            return;
        }

        console.log("\nSedang menghitung kemungkinan...");
        setTimeout(() => {
            const hasil = cariRumusYangCocok(daftarAngka, target);
            console.log(`\nHasil: ${hasil}`);
            rl.close();
        }, 500);
    });
});
