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

    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #CPF').val(obj.CPF);
    }

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
                window.location.href = urlRetorno;
            }
        });
    });

    if (typeof ViewBag !== 'undefined' && ViewBag.Beneficiarios) {
        ViewBag.Beneficiarios.forEach(function(ben) {
            let newRow = `<tr data-cpf="${ben.CPF}">
                <td>${ben.CPF}</td>
                <td>${ben.Nome}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-alterar">Alterar</button>
                    <button class="btn btn-sm btn-danger btn-excluir">Excluir</button>
                </td>
            </tr>`;
            $('#gridBeneficiarios tbody').append(newRow);
        });
    }
})
