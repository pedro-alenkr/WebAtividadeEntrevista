$(document).ready(function () {
    $('#CPF').on('input', function () {
        $(this).val(formatarCPF($(this).val()));
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
                "beneficiarios": beneficiarios,
                "Id": $("#clientId").val()
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
                window.location.href = urlRetorno;
            }
        });
    })
    
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
