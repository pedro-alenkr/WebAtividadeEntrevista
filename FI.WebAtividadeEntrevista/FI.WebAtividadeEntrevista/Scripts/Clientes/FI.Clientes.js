$(document).ready(function () {
    $('#CPF').on('input', function () {
        $(this).val(formatarCPF($(this).val()));
    });
    $('#Telefone').on('input', function () {
        $(this).val(formatarTelefone($(this).val()));
    });
    $('#CEP').on('input', function () {
        $(this).val(formatarCEP($(this).val()));
    });

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        let valido = validarCPF($(this).find("#CPF").val())

        if (!valido) {
            ModalDialog("CPF inválido", "Por favor, informe um CPF válido.");
            return false;
        }
        // Serializa todos os campos do form, incluindo beneficiários
        var formData = $(this).serialize();
        $.ajax({
            url: urlPost,
            method: "POST",
            data: formData,
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();
                // Remove beneficiários ocultos após sucesso
                $("#formCadastro .beneficiario-hidden").remove();
            }
        });
    });

    if (typeof beneficiarios !== 'undefined' && beneficiarios) {
        beneficiarios.forEach(function(ben, i) {
            let newRow = `<tr data-index="${i}">
                <td>${ben.CPF}</td>
                <td>${ben.Nome}</td>
                <td>
                    <button class="btn btn-sm btn-danger btn-excluir">Excluir</button>
                </td>
            </tr>`;
            $('#gridBeneficiarios tbody').append(newRow);
            // Adiciona campos ocultos para edição
            var hiddenFields = `
                <input type="hidden" name="Beneficiarios[${i}].CPF" value="${ben.CPF}" />
                <input type="hidden" name="Beneficiarios[${i}].Nome" value="${ben.Nome}" />
            `;
            $('#formCadastro').append(`<div class="beneficiario-hidden" data-index="${i}">${hiddenFields}</div>`);
        });
    }
});
