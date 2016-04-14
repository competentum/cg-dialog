'use strict';

export default {

    /**
     *
     * @param {string} html
     * @returns {Node}
     */
    createHTML: function createHTML(html) {
        var div = document.createElement('div');
        div.innerHTML = html.trim();
        return div.firstChild;
    }
};