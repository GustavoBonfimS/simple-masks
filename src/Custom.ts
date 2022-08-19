import BaseMask from "./Base";

function getDefaultTranslation() {
    return {
        '9': (val: string) => val.replace(/[^0-9]+/g, ''),
        A: (val: string) => val.replace(/[^a-zA-Z]+/g, ''),
        S: (val: string) => val.replace(/[^a-zA-Z0-9]+/g, ''),
        '*': (val: string) => val,
    }
}

function toPattern(value: string, mask: string, translation: any) {
    let result = ''

    let maskCharIndex = 0
    let valueCharIndex = 0

    while (true) {
        // if mask is ended, break.
        if (maskCharIndex === mask.length) {
            break
        }

        // if value is ended, break.
        if (valueCharIndex === value.length) {
            break
        }

        let maskChar = mask[maskCharIndex]
        let valueChar = value[valueCharIndex]

        // value equals mask, just set
        if (maskChar === valueChar) {
            result += maskChar
            valueCharIndex += 1
            maskCharIndex += 1
            continue
        }

        // apply translator if match
        const translationHandler = translation[maskChar]

        if (translationHandler) {
            const resolverValue = translationHandler(valueChar || '')
            if (resolverValue === '') {
                //valueChar replaced so don't add it to result, keep the mask at the same point and continue to next value char
                valueCharIndex += 1;
                continue;
            } else if (resolverValue !== null) {
                result += resolverValue;
                valueCharIndex += 1;
            } else {
                result += maskChar;
            }
            maskCharIndex += 1
            continue
        }

        // not masked value, fixed char on mask
        result += maskChar
        maskCharIndex += 1
        continue
    }

    return result
}

const DEFAULT_TRANSLATION = getDefaultTranslation()

class CustomMask extends BaseMask {
    static getType() {
        return 'custom'
    }

    static getDefaultTranslation() {
        return getDefaultTranslation()
    }

    static shared = new CustomMask()

    getKeyboardType() {
        return 'default'
    }

    getValue(value: string, settings: any) {
        if (value === '') {
            return value
        }
        let { mask } = settings
        let translation = this.mergeSettings(
            DEFAULT_TRANSLATION,
            settings.translation
        )

        var masked = toPattern(value, mask, translation)
        return masked
    }

}

export default CustomMask;
