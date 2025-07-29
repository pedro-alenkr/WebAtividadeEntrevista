window.listaBeneficiariosCliente = window.listaBeneficiariosCliente || [];

function BeneficiariosModal() {
    var random = Math.random().toString().replace('.', '');
    var texto = `<div id="${random}" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title">Beneficiarios</h4>
                </div>
                <div class="modal-body">
                    <form id="formBeneficiario">
                        <div class="row">
                            <div class="col-md-5">
                                <div class="form-group">
                                    <label for="CPFBeneficiario">CPF:</label>
                                    <input required="required" type="text" class="form-control" id="CPFBeneficiario" name="CPF" placeholder="Ex.: 010.011.111-00" maxlength="14">
                                </div>
                            </div>
                            <div class="col-md-5">
                                <div class="form-group">
                                    <label for="NomeBeneficiario">Nome:</label>
                                    <input required="required" type="text" class="form-control" id="NomeBeneficiario" name="Nome" placeholder="Ex.: Maria">
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-group">
                                    <label>&nbsp;</label>
                                    <button type="submit" class="btn btn-sm btn-success form-control">Incluir</button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div class="row">
                        <div class="col-md-12">
                            <table class="table" id="gridBeneficiarios">
                                <thead>
                                    <tr>
                                        <th>CPF</th>
                                        <th>Nome</th>
                                        <th>Acoes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
                </div>
            </div>
        </div>
    </div>`;

    $('body').append(texto);
    
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
                    <button class="btn btn-sm btn-primary btn-excluir">Excluir</button>\
                </td>\
            </tr>';
            tbody.append(newRow);
        }
    }
    renderizarGridBeneficiarios();

    $('#CPFBeneficiario').on('input', function() {
        $(this).val(formatarCPF($(this).val()));
    });

    $('#formBeneficiario').submit(function(e) {
        e.preventDefault();
        
        var cpf = $('#CPFBeneficiario').val();
        var nome = $('#NomeBeneficiario').val();
        var cpfDuplicadoNoGrid = false;

        for (var i = 0; i < window.listaBeneficiariosCliente.length; i++) {
            if (window.listaBeneficiariosCliente[i].CPF === cpf) {
                cpfDuplicadoNoGrid = true;
                break;
            }
        }
        if (cpfDuplicadoNoGrid) {
            ModalDialog("CPF ja incluido", "Este CPF ja esta na lista de beneficiarios.");
            return;
        }

        if (!validarCPF(cpf)) {
            ModalDialog("CPF invalido", "Por favor, informe um CPF valido.");
            return;
        }

        window.listaBeneficiariosCliente.push({ CPF: cpf, Nome: nome });
        renderizarGridBeneficiarios();
        $('#CPFBeneficiario').val('');
        $('#NomeBeneficiario').val('');
    });

    $('#gridBeneficiarios').on('click', '.btn-excluir', function() {
        var row = $(this).closest('tr');
        var cpf = row.find('td:eq(0)').text();
        window.listaBeneficiariosCliente = window.listaBeneficiariosCliente.filter(function(ben) {
            return ben.CPF !== cpf;
        });
        renderizarGridBeneficiarios();
    });

    $('#gridBeneficiarios').on('click', '.btn-alterar', function() {
        var row = $(this).closest('tr');
        var cpf = row.find('td:eq(0)').text();
        var nome = row.find('td:eq(1)').text();
        $('#CPFBeneficiario').val(cpf);
        $('#NomeBeneficiario').val(nome);
        window.listaBeneficiariosCliente = window.listaBeneficiariosCliente.filter(function(ben) {
            return ben.CPF !== cpf;
        });
        renderizarGridBeneficiarios();
    });

    $('#' + random).on('hidden.bs.modal', function () {
        $('#' + random).remove();
    });

    $('#' + random).modal('show');
}

function getBeneficiariosData() {
    return window.listaBeneficiariosCliente.slice();
}