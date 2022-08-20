class FormObject extends HTMLElement 
{
    /**
     * @type {string}
     */
    #src;
    /**
     * @type {HTMLFormElement}
     */
    formElement;
    /**
     * @type {HTMLButtonElement}
     */
    submitButton;
    /**
     * @type {HTMLElement}
     */
    titleElement;
    /**
     * @type {HTMLFieldSetElement[]}
     */
    sectionElements;

    constructor ()
    {
        super();
        this.formElement = document.createElement("form");
        this.titleElement = document.createElement("h2");
        this.formElement.appendChild(this.titleElement);
        this.submitButton = document.createElement("button");
        this.submitButton.type = "button";
        this.submitButton.onclick = (e) => this.sendForms (e);
        if(this.hasAttribute("src"))
        {
            this.src = this.getAttribute("src");
        }
    }

    set src (_src)
    {
        this.#src = _src;
        this.loadSrc ();
    }

    get src ()
    {
        return this.#src;
    }

    async loadSrc ()
    {
        const data = await fetch(this.#src).then(resp => resp.json());
        this.build (data);
    }

    build (data)
    {
        this.titleElement = data.title;

        data.sections.forEach(section => 
        {
            this.formElement.append(this.createSection(section));
        });

        this.submitButton.innerText = data.submit;
        this.formElement.appendChild(this.submitButton);
        this.appendChild(this.formElement);
    }

    createSection (section)
    {
        const sectionElement = document.createElement("fieldset");

        const sectionLegendElement = document.createElement("legend");
        sectionLegendElement.innerText = section.name;
        sectionElement.appendChild(sectionLegendElement);

        return sectionElement;
    }

    createRadios (sectionElement, options)
    {
        const optionsElement = document.createElement("div");
        options.forEach(option => 
        {
            const optionElement = document.createElement("span");


        });
        sectionElement.appendChild(optionsElement);
    }

    sendForms (e)
    {
        const form = e.target.parentElement;
        const formData = new FormData(form);

        console.log("Send forms", formData);
    }
}

customElements.define("form-object", FormObject);