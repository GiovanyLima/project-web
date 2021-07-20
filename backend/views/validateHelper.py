from validate_docbr import CPF, PIS
from validate_email import validate_email

cpf = CPF()
pis = PIS()


# Validar CPF
def cpf_validate(cpf_entry):
    receive_cpf = cpf.mask(cpf_entry)
    return cpf.validate(receive_cpf)


# Validar PIS
def pis_validate(pis_entry):
    receive_pis = pis.mask(pis_entry)
    return pis.validate(receive_pis)


# Validar E-Mail
def email_validate(email):
    return validate_email(email)
