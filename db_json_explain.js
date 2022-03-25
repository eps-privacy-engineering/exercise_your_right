// Several potential html Element

// href with tag a
<a class="..." href="https://..." id="xc-footer--terms-link">Do Not Sell My Personal Information</a>
var dict1 = {
    "text": "Do Not Sell My Personal Information",
    "category": "href",
    "operation_type": "click",
    "html_id": "xc-footer--terms-link"
};
// button
<button class="button button--primary opt-out-all-btn" data-ref="opt-out-all"> Opt Out of Everything </button>
var dict2 = {
    "text": "Opt Out of Everything",
    "category": "button",
    "operation_type": "click",
    "html_id": "" // ???
};
// text (maybe include other element, e.g., entry)
<ul>
    <li>We don’t show you personalized ads based on <a className="YfaGG"
                                                       href="privacy?hl=en#footnote-sensitive-categories"
                                                       data-name="sensitive-categories"
                                                       jsaction="click:IPbaae(preventDefault=true)">sensitive
        categories</a>, such as race, religion, sexual orientation, or health.
    </li>
    <li>We don’t show you personalized ads based on your content from Drive, Gmail, or Photos.</li>
    <li>We don’t share information that personally identifies you with advertisers, such as your name or email, unless
        you ask us to. For example, if you see an ad for a nearby flower shop and select the “tap to call” button, we’ll
        connect your call and may share your phone number with the flower shop.
    </li>
</ul>
var dict3 = {
    "text": "We don’t  do B",
    "category": "text",
    "operation_type": "show",
    "html_id": "" // ???
};