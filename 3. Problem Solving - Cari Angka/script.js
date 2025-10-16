let a = [];

function tambahAngka() {
    let input = document.getElementById('angka')
    let value = parseInt(input.value)
    if (a.includes(value)) {
        alert('angka sudah ada');
        return;
    }
    if (isNaN(value)) {
        alert('Masukkan angka yang valid');
        return;
    }
    a.push(value);
    document.getElementById('array').textContent = JSON.stringify(a);
    input.value = "";
}

function cariAngka() {
    let Angkahilang = [];
    let max = a.length;
    let awal = a[0];
    let akhir = a[0];
    for (let i = 0; i <= max; i++) {
        if (a[i] < awal) awal = a[i]
        if (a[i] > akhir) akhir = a[i]
    }
    for (let i = awal; i <= akhir; i++) {
        if (!a.includes(i)) {
            Angkahilang.push(i);
        }
    }
    document.getElementById("angkaHilang").textContent = JSON.stringify(Angkahilang);
    console.log(a.length);
}