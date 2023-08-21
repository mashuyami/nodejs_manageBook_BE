
export const generateCode = (value) => {
    let output = ''
    // tu tieng viet tra ve tieng anh khong dau
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').forEach(item => {
        output += item.charAt(1) + item.charAt(0)
    });
    return output.toUpperCase() + value.length
}
