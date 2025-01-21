function Note(title, content, dateCreation = new Date()) {
    this.title = title;
    this.content = content;
    this.dateCreation = dateCreation;
}

Note.prototype.setTitle = function (title) {
    this.title = title;
};

Note.prototype.setContent = function (content) {
    this.content = content;
};

class NoteView {
    constructor(note) {
        this.note = note;
    }

    convert() {
        let text = `# ${this.note.title}
### ${this.note.dateCreation.toLocaleDateString()}
${this.note.content}`;
        let conv = new showdown.Converter();
        return conv.makeHtml(text);
    }

    display() {
        document.querySelector("#currentNoteView").innerHTML = this.convert(
            this.note
        );
    }
}

const noteFormView = {
    display() {
        document
            .getElementById("noteForm")
            .classList.remove("create_edit_note-hidden");
    },
    hide() {
        document
            .getElementById("noteForm")
            .classList.add("create_edit_note-hidden");
    },
    validate() {
        let titre = document.querySelector("#form_add_note_title").value,
            contenu = document.querySelector("#form_add_note_text").value;

        noteapp.currentNote = new Note(titre, contenu);
        let noteView = new NoteView(noteapp.currentNote);
        noteView.display();
        noteFormView.hide();
    },
    init() {
        let validate_button = document.querySelector("#form_add_note_valid");
        validate_button.addEventListener("click", noteFormView.validate);
    },
};

const mainMenuView = {
    addHandler(event) {
        noteFormView.display();
    },
    init() {
        document
            .getElementById("add")
            .addEventListener("click", this.addHandler);
    },
};

let noteapp = {
    currentNote: null,
    init: function () {
        mainMenuView.init();
        noteFormView.init();
    },
};

window.addEventListener("load", noteapp.init);
