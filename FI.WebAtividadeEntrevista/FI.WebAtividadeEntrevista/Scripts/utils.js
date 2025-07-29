function formatarCPF(input) {
    var v = input.replace(/\D/g, '');

    if (v.length > 11)
        v = v.slice(0, 11);

    v = v.replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    return v;
}

function calcularDigito(cpf, fator) {
    let soma = 0;
    for (let i = 0; i < fator - 1; i++) {
        soma += parseInt(cpf[i]) * (fator - i);
    }
    const resto = (soma * 10) % 11;
    return resto == 10 ? 0 : resto;
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    const digito1 = calcularDigito(cpf, 10);
    const digito2 = calcularDigito(cpf, 11);

    return digito1 == parseInt(cpf[9]) && digito2 == parseInt(cpf[10]);
}