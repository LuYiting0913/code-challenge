var sum_to_n_a = function(n) {
    return (1+n) * n / 2;
};

var sum_to_n_b = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

var sum_to_n_c = function(n) {
    const arr = Array.from({length: n}, (_, i) => i + 1);
    return arr.reduce((x, y) => x + y, 0)
};