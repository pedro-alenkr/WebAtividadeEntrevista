window.listaBeneficiariosCliente = window.listaBeneficiariosCliente || [];

$(document).ready(function () {
    $('#CPFBeneficiario').on('input', function () {
        $(this).val(formatarCPF($(this).val()));
    });

    $('#formBeneficiario').submit(function (e) {
        e.preventDefault();
        var cpf = $('#CPFBeneficiario').val();
        var nome = $('#NomeBeneficiario').val();

        if (!validarCPF(cpf)) {
            ModalDialog("CPF invalido", "Por favor, informe um CPF valido.");
            return;
        }

        var cpfDuplicado = false;
        $('#gridBeneficiarios tbody tr').each(function () {
            if ($(this).find('td:eq(0)').text() === cpf) {
                cpfDuplicado = true;
                return false;
            }
        });
        if (cpfDuplicado) {
            ModalDialog("CPF ja incluido", "Este CPF ja esta na lista de beneficiarios.");
            return;
        }

        var newRow = '<tr data-cpf="' + cpf + '">\
            <td>' + cpf + '</td>\
            <td>' + nome + '</td>\
            <td>\
                <button class="btn btn-sm btn-primary btn-alterar">Alterar</button>\
                <button class="btn btn-sm btn-danger btn-excluir">Excluir</button>\
            </td>\
        </tr>';
        $('#gridBeneficiarios tbody').append(newRow);
        $('#CPFBeneficiario').val('');
        $('#NomeBeneficiario').val('');
    });

    $('#gridBeneficiarios').on('click', '.btn-excluir', function () {
        $(this).closest('tr').remove();
    });

    $('#gridBeneficiarios').on('click', '.btn-alterar', function () {
        var row = $(this).closest('tr');
        var cpf = row.find('td:eq(0)').text();
        var nome = row.find('td:eq(1)').text();
        $('#CPFBeneficiario').val(cpf);
        $('#NomeBeneficiario').val(nome);
        row.remove();
    });

    function renderizarGridBeneficiarios() {
        var tbody = $('#gridBeneficiarios tbody');
        tbody.empty();
        for (var i = 0; i < window.listaBeneficiariosCliente.length; i++) {
            var ben = window.listaBeneficiariosCliente[i];
            var newRow = '<tr data-cpf="' + ben.CPF + '">\
                <td>' + ben.CPF + '</td>\
                <td>' + ben.Nome + '</td>\
                <td>\
                    <button class="btn btn-sm btn-primary btn-alterar">Alterar</button>\
                    <button class="btn btn-sm btn-danger btn-excluir">Excluir</button>\
                </td>\
            </tr>';
            tbody.append(newRow);
        }
    }
    renderizarGridBeneficiarios();
});

function getBeneficiariosData() {
    var beneficiarios = [];
    $('#gridBeneficiarios tbody tr').each(function () {
        beneficiarios.push({
            CPF: $(this).find('td:eq(0)').text(),
            Nome: $(this).find('td:eq(1)').text()
        });
    });
    return beneficiarios;
}