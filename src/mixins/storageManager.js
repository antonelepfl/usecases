
/* eslint-disable no-console */
const BSP_TERMS = 'bsp-terms-accepted'
export default {
  termsAcceptedLocally (category) {
    /* eslint no-undef: 0 */
    let termsStored = localStorage.getItem(BSP_TERMS)
    try {
      let parsed = JSON.parse(termsStored)
      if (parsed.includes(category)) return true
      return false
    } catch (e) {
      return false
    }
  },

  saveTermsAccept (category) {
    /* eslint no-undef: 0 */
    let termsLocally = localStorage.getItem(BSP_TERMS)
    try {
      let parsed = JSON.parse(termsLocally) || []
      if (!parsed.includes(category)) {
        parsed.push(category)
        localStorage.setItem(BSP_TERMS, JSON.stringify(parsed))
      }
    } catch (e) {
      console.error('Error updating accepted terms locally')
    }
  }
}
