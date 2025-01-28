let currentExercise = 0;

window.addEventListener("load", () => {
    /**
     * EXERCICE 1
     */
    let section;
    const title = "TP1 - Notes";
    const content =
        "Le premier TP consiste à développer une application de prise de note";
    currentExercise++;
    describe("Constructeur objet Section", () => {
        expect(
            Section.prototype.constructor.name,
            "Section",
            "La classe Section n'existe pas"
        );

        section = new Section(title, content);
    });

    describe("Méthode Section.search", () => {
        expect(
            section.search("développer"),
            true,
            "Recherche d'un mot existant"
        );
        expect(section.search("TP1"), false, "Recherche d'un mot non existant");
    });

    describe("Méthode Section.size", () => {
        expect(section.size(), content.length, "Taille de la section");
    });

    describe("Méthode Section.md", () => {
        const md = section
            .toMarkdown()
            .split("\n")
            .map((l) => l.trim());

        expect(
            (md.includes(`###${title}`) || md.includes(`### ${title}`)) &&
                md.includes(content),
            true,
            "Transformation en markdown",
            `<p>Le markdown envoyé n'est pas valide : </p>
            <pre>${section.toMarkdown()}</pre>`
        );
    });

    /**
     * EXERCICE 2
     */
    currentExercise++;
    let document;
    const titleDocument = "Titre du document";
    const author = "John Doe";

    describe("Constructeur objet Document", () => {
        expect(
            Document.prototype.constructor.name,
            "Document",
            "La classe Document n'existe pas"
        );
        document = new Document(titleDocument, author);
        expect(
            Object.keys(document).length >= 4,
            true,
            "La classe Document doit exister"
        );
    });

    describe("Méthode Document.addSection", () => {
        expect(
            typeof document.addSection,
            "function",
            "La méthode n'existe pas"
        );
        document.addSection(section);
    });

    describe("Méthode Document.size", () => {
        expect(
            document.size(),
            content.length,
            "Mauvaise taille du document avec une section"
        );

        const title2 = "TP2 - Documents";
        const content2 =
            "Le second TP consiste à développer une application de gestion de document";
        const section2 = new Section(title2, content2);
        document.addSection(section2);

        expect(
            document.size(),
            content.length + content2.length,
            "Mauvaise taille du document avec deux sections"
        );
    });

    describe("Methode Document.toMarkdown", () => {
        expect(
            document.toMarkdown instanceof Function,
            true,
            "La methode toMarkdown n'existe pas"
        );

        generatePreCard("toMarkdown", document.toMarkdown());
    });

    describe("Methode Document.toHTML", () => {
        expect(
            document.toHTML instanceof Function,
            true,
            "La methode toHTML n'existe pas"
        );
        generatePreCard("toHTML", document.toHTML());
    });
});

/**
 *
 * HELPERS
 *
 */

class TestError extends Error {
    constructor(message) {
        super(message);
    }
}
const expect = (given, expected, overrideError) => {
    if (given !== expected) {
        throw new TestError(
            overrideError === undefined
                ? `Résultat attendu : "${expected}", "${given}" obtenu`
                : overrideError
        );
    }
};

const describe = (title, callback) => {
    try {
        callback();
        generateCard(title, "ok", true);
    } catch (e) {
        console.error(e);
        generateCard(title, e instanceof TestError ? e.message : e, false);
    }
};

const generateCard = (title, content, success) => {
    const container = document.getElementById(`exercise-${currentExercise}`);
    const card = document.createElement("div");
    card.classList.add(
        "card",
        "mb-4",
        "mt-4",
        success ? "has-background-success" : "has-background-danger",
        success ? "has-text-success-invert" : "has-text-danger-invert"
    );
    card.innerHTML = `<header class="card-header">
            <p class="card-header-title">${title}</p>
        </header>`;
    if (!success) {
        card.innerHTML += `
        <div class="card-content">
            <div class="content">${content}</div>
        </div>`;
    }

    container.appendChild(card);
};

const generatePreCard = (title, preContent) => {
    const container = document.getElementById(`exercise-${currentExercise}`);
    const card = document.createElement("div");
    card.classList.add("card", "mb-4", "mt-4");
    card.innerHTML = `<header class="card-header">
            <p class="card-header-title">${title}</p>
        </header>
        <div class="card-content">
            <div class="content"><pre>${preContent}</pre></div>
        </div>`;
    container.appendChild(card);
};
