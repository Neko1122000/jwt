exports.getNumberIfPossitive = async (str) => {
    const value = Number(str);
    if (isNaN(value) || value <= 0) return NaN;
    return value;
}