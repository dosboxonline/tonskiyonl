function filterMovies() {
    const searchInput = document.getElementById("search-bar").value.toLowerCase().trim();
    const movieList = document.getElementById("azlist");
    const headings = Array.from(movieList.getElementsByTagName("h2"));
    const listItems = Array.from(movieList.getElementsByTagName("li"));

    function romanToArabic(text) {
        const romanMap = { "I": 1, "II": 2, "III": 3, "IV": 4, "V": 5, "VI": 6, "VII": 7, "VIII": 8, "IX": 9, "X": 10, "XI": 11, "XII": 12, "XIII": 13, "XIV": 14, "XV": 15 };
        return text.replace(/\b(I{1,3}|IV|V?I{0,3}|IX|X{1,3}|XI|XII|XIII|XIV|XV)\b/g, match => romanMap[match] || match);
    }

    function decodeHtmlEntities(text) {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = text;
        return textarea.value;
    }

function normalizeText(text) {
    return romanToArabic(decodeHtmlEntities(text.toUpperCase()))
        .toLowerCase()
        .replace(/^\s*(the|a|an)\s+/i, "") // Убираем артикли только в начале строки
        .replace(/\b(episode|part|chapter|volume)\b/g, "") // Убираем "Episode", "Part", "Chapter"
        .replace(/&#39;|&apos;|’|‘|'/g, "") // Апострофы
        .replace(/&amp;|&/g, " and ") // Амперсанд
        .replace(/&#34;|&quot;/g, '"') // Кавычки
        .replace(/&#96;|&grave;/g, '`') // Гравис
        .replace(/&#58;|&colon;/g, ':') // Двоеточие
        .replace(/&#45;|&hyphen;/g, '-') // Дефис
        .replace(/&#46;|&period;/g, ".") // Точка
        .replace(/[:.,]/g, " ") // Убираем двоеточия, точки, запятые
        .replace(/[()\-/]/g, " ") // Заменяем скобки и слеши на пробелы
        .replace(/\s+/g, " ") // Убираем лишние пробелы
        .trim();
}

    let searchQuery = normalizeText(searchInput);
    let visibleSections = new Map();

    listItems.forEach(item => {
        const link = item.querySelector("a");
        if (!link) return;

        let movieName = normalizeText(link.textContent);
        let categories = item.getAttribute("data-category") || "";
        let normalizedCategories = normalizeText(categories);
        const href = link.getAttribute("href");

        const isYearQuery = /^\d{4}$/.test(searchQuery);
        let movieYear = "";
        if (href) {
            const yearMatch = href.match(/-(\d{4})\.html$/);
            movieYear = yearMatch ? yearMatch[1] : "";
        }

        const matchByName = movieName.includes(searchQuery);
        const matchByCategory = normalizedCategories.includes(searchQuery);
        const matchByYear = isYearQuery && movieYear === searchQuery;

        if (matchByName || matchByCategory || matchByYear) {
            item.style.display = "list-item";
            let parentHeading = item.closest("ul").previousElementSibling;
            if (parentHeading && parentHeading.tagName === "H2") {
                visibleSections.set(parentHeading, true);
            }
        } else {
            item.style.display = "none";
        }
    });

    headings.forEach(heading => {
        const associatedList = heading.nextElementSibling;
        if (associatedList && associatedList.tagName === "UL") {
            const hasVisibleItems = Array.from(associatedList.getElementsByTagName("li"))
                .some(li => li.style.display !== "none");
            heading.style.display = hasVisibleItems ? "block" : "none";
        }
    });
}

// Очистка поиска
function clearSearch() {
    const searchBar = document.getElementById("search-bar");
    const listItems = document.querySelectorAll("#azlist li");
    const headings = document.querySelectorAll("#azlist h2");

    searchBar.value = "";

    listItems.forEach(item => {
        item.style.display = "list-item";
    });

    headings.forEach(heading => {
        heading.style.display = "block";
    });

    searchBar.blur();
}

// Закрытие клавиатуры на мобильных при нажатии Enter
const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchBar.blur();
    }
});

window.filterMovies = filterMovies;
window.clearSearch = clearSearch;
