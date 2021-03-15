/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import 'normalize.css';

export const onInitialClientRender = () => {
    setTimeout(function () {
        if (document.getElementById("___loader"))
            document.getElementById("___loader").style.display = "none"
    }, 1000)
}