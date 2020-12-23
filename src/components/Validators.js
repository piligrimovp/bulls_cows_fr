export function validateEmail(value) {
    let status = true, message = '';
    switch (true) {
        case !/^[\s]*[a-zA-Z0-9-_]+\.?([a-zA-Z0-9_-]+\.)*[a-zA-Z0-9_-]*@((([a-zA-Z0-9]+\.)*([a-zA-Z0-9]+-)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}(?!@))|(([а-яА-ЯёЁ0-9]+\.)*([а-яА-ЯёЁ0-9]+-)*[а-яА-ЯёЁ0-9]+\.[а-яА-ЯёЁ]{2,6}(?!@)))[\s]*$/.test(value):
            status = false;
            message = 'Введите корректный email';
            break;
        default: break;
    }

    return [status, message];
}

export function validateName(value) {
    let status = true, message = '';
    switch (true) {
        case value.length < 1:
            status = false;
            message = 'Минимальная длина - 1 символ';
            break;
        default: break;
    }

    return [status, message];
}

export function validatePassword(value) {
    let status = true, message = '';
    switch (true) {
        case value.length < 6:
            status = false;
            message = 'Минимальная длина пароля - 6 символов';
            break;
        default: break;
    }

    return [status, message];
}

export function validatePasswordConfirm(value, password) {
    if (value === password) {
        return [true, ''];
    }

    return [false, 'Пароли не совпадают'];
}