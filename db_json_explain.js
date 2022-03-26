var dict_all = {
    "www.xfinity.com": {
        "privacy_policy_updated_yet":1,
        "privacy_policy_link":"http://www.xfinity.com/privacy/policy",
        "ccpa_OptOut": "http://www.xfinity.com/privacy/opt-out",
        "ccpa_DoNotSell": "https://www.xfinity.com/privacy/manage-preference",
        "": "<button></button>",
        "ccpa_do_not_sell_gpc":
            {
                "text": "Privacy Policies",
                "category": "input",
                "operation_type": "click",
                "html_id": "a7"
            },
    }
}
<a> href="~" dns</a>
var dict_all1={
    "www.cmu.edu": {
    "ccpa_do_not_sell": null,
        "ccpa_delete": {
        "right_type": "CCPADelete",
            "exercise_path": [
            {
                "text": "Privacy Policies",
                "category": "input",
                "operation_type": "click",
                "html_id": "a7"
            },
            {
                "text": "Delete my data",
                "category": "input",
                "operation_type": "click",
                "html_id": "a9"
            }
        ]
    },
    "ccpa_copy": null
},
    "www.cmu2.edu": {
    "ccpa_do_not_sell": null,
        "ccpa_delete": {
        "right_type": "CCPADelete",
            "exercise_path": [
            {
                "text": "Privacy Policies",
                "category": "input",
                "operation_type": "click",
                "html_id": "a7"
            },
            {
                "text": "Delete my data",
                "category": "input",
                "operation_type": "click",
                "html_id": "a9"
            }
        ]
    },
    "ccpa_copy": null
}
}

// if (dict["privacy_policy_visited_yet"]===1){
//     fetch_page(dict);
// } else{
//     if (当前页面===dict["privacy_policy_link"]){
//         刷；
//     } else{
//         不刷；fetch_page 里有 pop——up(dict["privacy_policy_link"]);
//     }
// }

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