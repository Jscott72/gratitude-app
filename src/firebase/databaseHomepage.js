import { auth, db } from "./firebaseConfig";
import { ref, onValue, push, query } from 'firebase/database';

//creates a new journal entry for the user and puts it into their database location
//If the visibility is set to true add the journal entry to the community page as well
export function createNewEntry(headline, content, visibility) {
    var date = time();
    const userId = auth.currentUser.uid;

    const username = localStorage.getItem('Username');

    push(ref(db, "users/" + userId + "/posts"), {
        date: date,
        Headline: headline,
        content: content,
        visibility: visibility
    })
        .then(() => {
            if (visibility === true) {
                push(ref(db, 'community/posts'), {
                    date: date,
                    Headline: headline,
                    Username: username
                });
            }
        })
        .catch((error) => {

        })
}

//displays the list of journal entries for the user on their homepage 
export function homepageJournalList(userId) {
    return new Promise((resolve, reject) => {
        const data = [];
        const dbRef = ref(db, 'users/' + userId + '/posts');

        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();

                if (childData && childData.Headline && childData.date) {
                    var { Headline, date } = childData;
                    Headline.trim();
                    date.trim();
                    var inputString = "Headline: " + Headline + "   *****   Date: " + date;
                    data.push(inputString);
                }
            });
            resolve(data);
        }, (error) => {
            reject(error);
        });
    });
}

//gets the content for the user's journal entry when they click the link on their homepage 
export function getUserEntryContent(headline, date) {
    return new Promise((resolve, reject) => {
        const dbRef = ref(db, 'users/' + auth.currentUser.uid + "/posts");
        var content;

        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                if (childData.Headline === headline && childData.date === date) {
                    content = childData.content;
                }
            });
            resolve(content);
        }, (error) => {
            reject(error);
        });
    });
}

//gets the list of headlines from the user's journal entries to create the wordcloud on the user's homepage 
export function wordCloudList(userId) {
    return new Promise((resolve, reject) => {
        const data = [];
        const dbRef = query(ref(db, 'users/' + userId + '/posts'));

        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();

                if (childData && childData.Headline && childData.content) {
                    var { Headline, content } = childData;
                    Headline.trim();
                    content.trim();
                    var inputString = "Headline: " + Headline + "   *****   content: " + content;
                    data.push(inputString);
                }
            });
            resolve(data);
        }, (error) => {
            reject(error);
        });
    });
}

//gets the time that the entry was created
function time() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const dayOfMonth = String(now.getDate()).padStart(2, "0");
    const dayOfWeek = now.getDay();
    var hour = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");

    var day;
    var Month;

    switch (dayOfWeek) {
        case 0:
            day = "Sunday";
            break;
        case 1:
            day = "Monday";
            break;
        case 2:
            day = "Tuesday";
            break;
        case 3:
            day = "Wednesday";
            break;
        case 4:
            day = "Thursday";
            break;
        case 5:
            day = "Friday";
            break;
        case 6:
            day = "Saturday";
            break;
        default:
            day = "Unknown Day";
    }

    switch (month) {
        case 1:
            Month = "January"
            break;
        case 2:
            Month = "February"
            break;
        case 3:
            Month = "March"
            break;
        case 4:
            Month = "April"
            break;
        case 5:
            Month = "May"
            break;
        case 6:
            Month = "June"
            break;
        case 7:
            Month = "July"
            break;
        case 8:
            Month = "August"
            break;
        case 9:
            Month = "September"
            break;
        case 10:
            Month = "October"
            break;
        case 11:
            Month = "November"
            break;
        case 12:
            Month = "December"
            break;
        default:
            Month = "unknown month"
    }

    var ampm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12;
    hour = hour ? hour : 12;
    Month = Month.padStart(2, "0");

    return `${day}, ${Month} ${dayOfMonth}, ${year}, ${hour}:${minutes} ${ampm}`
}

//deletes a journal entry from the user's location in the database 
//If the entry is on the community page as well, deletes the entry from the community page
export function deleteJournalEntry(headline, date) {

}