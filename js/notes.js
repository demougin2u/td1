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
        document.getElementById("form_add_note_title").value = null;
        document.getElementById("form_add_note_text").value = null;
        let validate_button = document.querySelector("#form_add_note_valid");
        validate_button.removeEventListener("click", noteFormView.update);
        validate_button.addEventListener("click", noteFormView.validate);
    },
    hide() {
        document
            .getElementById("noteForm")
            .classList.add("create_edit_note-hidden");
    },
    validate() {
        console.log("validate");
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
    edit() {
        const note = noteapp.notes.getNoteById(noteapp.currentNoteId);
        let validate_button = document.querySelector("#form_add_note_valid");
        document.getElementById("form_add_note_title").value = note.title;
        document.getElementById("form_add_note_text").value = note.content;
        validate_button.removeEventListener("click", noteFormView.validate);
        validate_button.addEventListener("click", noteFormView.update);

        document
            .getElementById("noteForm")
            .classList.remove("create_edit_note-hidden");
    },
    update() {
        let titre = document.querySelector("#form_add_note_title").value,
            contenu = document.querySelector("#form_add_note_text").value;

        const note = new Note(titre, contenu);
        noteapp.notes.editNote(noteapp.currentNoteId, note);

        let noteView = new NoteView(
            noteapp.notes.getNoteById(noteapp.currentNoteId)
        );
        noteView.display();
        noteFormView.hide();
    },
};

const mainMenuView = {
    addHandler(event) {
        noteFormView.display();
    },
    deleteHandler(event) {
        noteapp.notes.deleteNote(noteapp.currentNoteId);
        noteListMenuView.deleteNote(noteapp.currentNoteId);
        noteapp.currentNoteId = 0;
    },
    editHandler(event) {
        noteFormView.edit();
    },
    init() {
        document
            .getElementById("add")
            .addEventListener("click", this.addHandler);

        document
            .getElementById("del")
            .addEventListener("click", this.deleteHandler);
        document
            .getElementById("edit")
            .addEventListener("click", this.editHandler);
    },
};

class NoteList {
    constructor() {
        this.notes = [];
    }

    addNote(note) {
        this.notes.push(note);
        this.save();
        return this.notes.length - 1;
    }

    deleteNote(noteId) {
        this.notes.splice(noteId, 1);
        this.save();
    }

    editNote(noteId, note) {
        this.notes[noteId] = note;
        this.save();
    }

    getNoteById(id) {
        return this.notes[id];
    }

    getList() {
        return this.notes;
    }

    save() {
        localStorage.setItem("noteList", JSON.stringify(this.notes));
    }

    load() {
        this.notes = JSON.parse(localStorage.getItem("noteList")).map(
            (unformattedNote) =>
                new Note(
                    unformattedNote.title,
                    unformattedNote.content,
                    new Date(unformattedNote.dateCreation)
                )
        );
    }
}

let noteapp = {
    currentNoteId: 0,
    notes: new NoteList(),
    init: function () {
        mainMenuView.init();
        noteapp.notes.load();
        noteListMenuView.displayList(noteapp.notes.getList());
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
        let noteListElement = document.getElementById("noteListMenu");
        let div = this.getDivFromNote(note);

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

    displayList: function (notes) {
        notes.forEach((note) => noteListMenuView.displayItem(note));
    },
    deleteNote: function (noteId) {
        let notesElements = document.getElementById("noteListMenu");
        notesElements.removeChild(notesElements.childNodes[noteId]);
    },
    getDivFromNote: function (note) {
        let text =
            note.title +
            " " +
            new Intl.DateTimeFormat("fr-FR").format(note.dateCreation);

        let div = document.createElement("div");
        div.textContent = text;
        div.classList.add("note_list_item", "note_list_item-selected");
        return div;
    },
    editNote: function (noteId, note) {
        let noteElement =
            document.getElementById("noteListMenu").childNodes[noteId];
    },
};

window.addEventListener("load", noteapp.init);
