$(document).ready(function () {
    var idCliente = 0;
    if (typeof obj !== 'undefined' && obj.Id > 0) {
        idCliente = obj.Id;
    }

    function preencherGridBeneficiarios() {
        $('#gridBeneficiarios tbody').empty();
        $('#formCadastro .beneficiario-hidden').remove();

        if (obj && obj.Beneficiarios && obj.Beneficiarios.length > 0) {
            obj.Beneficiarios.forEach(function (b, i) {
                var cpf = b.CPF;
                var nome = b.Nome;
                var id = b.Id ? b.Id : '';
                var newRow = `<tr data-index="${i}" data-id="${id}">
                    <td>${cpf}</td>
                    <td>${nome}</td>
                    <td>
                        <button type="button" class="btn btn-primary btn-sm btn-alterar">Alterar</button>
                        <button type="button" class="btn btn-primary btn-sm btn-excluir">Remover</button>
                    </td>
                </tr>`;
                $('#gridBeneficiarios tbody').append(newRow);

                var hiddenFields = `
                    <input type="hidden" name="Beneficiarios[${i}].CPF" value="${cpf}" />
                    <input type="hidden" name="Beneficiarios[${i}].Nome" value="${nome}" />
                    <input type="hidden" name="Beneficiarios[${i}].Id" value="${id}" />
                `;
                $('#formCadastro').append(`<div class="beneficiario-hidden" data-index="${i}">${hiddenFields}</div>`);
            });
        }
    }

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
        if (!cpf || !nome) {
            ModalDialog("Erro", "Preencha todos os campos!");
            return;
        }

        var duplicado = false;
        $('#gridBeneficiarios tbody tr').each(function () {
            if ($(this).find('td:eq(0)').text() === cpf) {
                duplicado = true;
                return false;
            }
        });
        if (duplicado) {
            ModalDialog("Erro", "CPF ja cadastrado para este cliente");
            return;
        }

        var index = $('#gridBeneficiarios tbody tr').length;
        var newRow = `<tr data-index="${index}">
            <td>${cpf}</td>
            <td>${nome}</td>
            <td>
                <button type="button" class="btn btn-primary btn-sm btn-alterar">Alterar</button>
                <button type="button" class="btn btn-primary btn-sm btn-excluir">Remover</button>
            </td>
        </tr>`;
        $('#gridBeneficiarios tbody').append(newRow);

        var hiddenFields = `
            <input type="hidden" name="Beneficiarios[${index}].CPF" value="${cpf}" />
            <input type="hidden" name="Beneficiarios[${index}].Nome" value="${nome}" />
        `;
        $('#formCadastro').append(`<div class="beneficiario-hidden" data-index="${index}">${hiddenFields}</div>`);

        $('#CPFBeneficiario').val('');
        $('#NomeBeneficiario').val('');
    });

    $('#gridBeneficiarios').on('click', '.btn-excluir', function () {
        var row = $(this).closest('tr');
        var index = row.data('index');
        var id = row.data('id');

        if (id) {
            $.ajax({
                url: '/Beneficiario/Excluir',
                type: 'POST',
                data: { id: id },
                success: function (result) {
                    if (result && result.Result === 'OK') {
                        row.remove();
                        $('#formCadastro .beneficiario-hidden[data-index="' + index + '"]').remove();
                        reindexarBeneficiarios();
                    } else {
                        ModalDialog('Erro', result.Message || 'Erro ao excluir beneficiário.');
                    }
                },
                error: function () {
                    ModalDialog('Erro', 'Erro ao excluir beneficiário.');
                }
            });
        } else {
            row.remove();
            $('#formCadastro .beneficiario-hidden[data-index="' + index + '"]').remove();
            reindexarBeneficiarios();
        }
    });

    $('#gridBeneficiarios').on('click', '.btn-alterar', function () {
        var row = $(this).closest('tr');
        var cpf = row.find('td:eq(0)').text();
        var nome = row.find('td:eq(1)').text();

        $('#CPFBeneficiario').val(cpf);
        $('#NomeBeneficiario').val(nome);

        var index = row.data('index');
        row.remove();
        $('#formCadastro .beneficiario-hidden[data-index="' + index + '"]').remove();

        reindexarBeneficiarios();
    });

    function reindexarBeneficiarios() {
        $('#gridBeneficiarios tbody tr').each(function (i) {
            $(this).attr('data-index', i);
        });

        $('#formCadastro .beneficiario-hidden').each(function (i) {
            $(this).attr('data-index', i);

            $(this).find('input[name^="Beneficiarios"]').each(function () {
                if ($(this).attr('name').endsWith('.CPF')) {
                    $(this).attr('name', `Beneficiarios[${i}].CPF`);
                } else if ($(this).attr('name').endsWith('.Nome')) {
                    $(this).attr('name', `Beneficiarios[${i}].Nome`);
                } else if ($(this).attr('name').endsWith('.Id')) {
                    $(this).attr('name', `Beneficiarios[${i}].Id`);
                }
            });
        });
    }

    $('#beneficiariosModal').on('show.bs.modal', function () {
        preencherGridBeneficiarios();
    });

    $("#beneficiarios").click(function () {
        $('#beneficiariosModal').modal('show');
    });
});
