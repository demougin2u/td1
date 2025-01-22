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

        const note = new Note(titre, contenu);
        noteapp.currentNoteId = noteapp.notes.addNote(note);
        noteListMenuView.displayItem(note);

        let noteView = new NoteView(
            noteapp.notes.getNoteById(noteapp.currentNoteId)
        );
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

class NoteList {
    constructor() {
        this.notes = [];
    }

    addNote(note) {
        this.notes.push(note);
        return this.notes.length - 1;
    }

    getNoteById(id) {
        return this.notes[id];
    }

    getList() {
        return this.notes;
    }
}

let noteapp = {
    currentNote: null,
    currentNoteId: 0,
    notes: new NoteList(),
    init: function () {
        mainMenuView.init();
        noteFormView.init();
        document
            .getElementById("noteListMenu")
            .addEventListener(
                "click",
                noteListMenuView.selectAndDisplayItemNote
            );
    },
};

let noteListMenuView = {
    displayItem: function (note) {
        let text =
            note.title +
            " " +
            new Intl.DateTimeFormat("fr-FR").format(note.dateCreation);

        let noteListElement = document.getElementById("noteListMenu");
        let div = document.createElement("div");
        div.textContent = text;
        div.classList.add("note_list_item", "note_list_item-selected");

        noteListElement.childNodes.forEach((element) =>
            element.classList.remove("note_list_item-selected")
        );
        noteListElement.append(div);
    },
    selectAndDisplayItemNote: function (event) {
        if (!event.target.classList.contains("note_list_item")) {
            return;
        }

        event.currentTarget.childNodes.forEach((element, id) => {
            if (element === event.target) {
                noteapp.currentNoteId = id;
                element.classList.add("note_list_item-selected");
                let noteView = new NoteView(
                    noteapp.notes.getNoteById(noteapp.currentNoteId)
                );
                noteView.display();
                noteFormView.hide();
            } else {
                element.classList.remove("note_list_item-selected");
            }
        });
    },
};

window.addEventListener("load", noteapp.init);
