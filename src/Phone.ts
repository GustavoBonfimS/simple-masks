import BaseMask from "./Base";
import CustomMask from "./Custom";

const PHONE_8_MASK = '9999-9999'
const PHONE_9_MASK = '99999-9999'
const PHONE_INTERNATIONAL = '+999 999 999 999'

const MASK_TYPES = {
    BRL: 'BRL',
    INTERNATIONAL: 'INTERNATIONAL'
}

const CEL_PHONE_SETTINGS = {
    maskType: MASK_TYPES.BRL,
    withDDD: true,
    dddMask: '(99) '
}

class CelPhoneMask extends BaseMask {
    static getType() {
        return 'cel-phone'
    }

    getValue(value: string, settings: any = {}) {
        let cleanedValue = super.removeNotNumbers(value)
        let mask = this.getMask(cleanedValue, settings)
        return CustomMask.shared.getValue(cleanedValue, { mask })
    }

    getMask(value: string, settings: any) {
        let mergedSettings = super.mergeSettings(CEL_PHONE_SETTINGS, settings)

        if (mergedSettings.maskType === MASK_TYPES.INTERNATIONAL) {
            return PHONE_INTERNATIONAL
        }

        let numbers = super.removeNotNumbers(value)
        let mask = PHONE_8_MASK

        let use9DigitMask = (() => {
            if (mergedSettings.withDDD) {
                let numbersDDD = super.removeNotNumbers(mergedSettings.dddMask)
                let remainingValueNumbers = numbers.substr(numbersDDD.length)
                return remainingValueNumbers.length >= 9
            } else {
                return numbers.length >= 9
            }
        })()

        if (use9DigitMask) {
            mask = PHONE_9_MASK
        }

        if (mergedSettings.withDDD) {
            mask = `${mergedSettings.dddMask}${mask}`
        }

        return mask
    }
}

export default CelPhoneMask;
