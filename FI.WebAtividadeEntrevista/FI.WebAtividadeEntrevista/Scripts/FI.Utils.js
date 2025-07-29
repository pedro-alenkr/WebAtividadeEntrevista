function formatarCPF(input) {
    var v = input.replace(/\D/g, '');

    if (v.length > 11)
        v = v.slice(0, 11);

    v = v.replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    return v;
}

function formatarTelefone(input) {
    var v = input.replace(/\D/g, '').slice(0, 11);

    if (v.length === 0) return '';

    v = v.replace(/^(\d{0,2})/, '($1')
        .replace(/(\(\d{2})(\d{0,5})/, '$1) $2');

    if (v.length > 10) {
        v = v.replace(/(\(\d{2}\)\s\d{5})(\d{1,4})/, '$1-$2');
    } else {
        v = v.replace(/(\(\d{2}\)\s\d{4})(\d{1,4})/, '$1-$2');
    }

    return v.trim();
}

function formatarCEP(input) {
    var v = input.replace(/\D/g, '');
    if (v.length > 8) v = v.slice(0, 8);
    if (v.length > 5) {
        v = v.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    }
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

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}