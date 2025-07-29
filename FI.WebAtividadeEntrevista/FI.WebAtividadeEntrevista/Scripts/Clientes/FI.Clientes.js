$(document).ready(function () {
    $('#CPF').on('input', function () {
        $(this).val(formatarCPF($(this).val()));
    });

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        let valido = validarCPF($(this).find("#CPF").val())

        if (!valido) {
            ModalDialog("CPF inválido", "Por favor, informe um CPF válido.");
            return false;
        }

        let beneficiarios = getBeneficiariosData();

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": $(this).find("#CPF").val(),
                "beneficiarios": beneficiarios
            },
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
            }
        });
    })
    
    if (typeof beneficiarios !== 'undefined' && beneficiarios) {
        beneficiarios.forEach(function(ben) {
            let newRow = `<tr data-cpf="${ben.CPF}>
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
