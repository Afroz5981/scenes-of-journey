document.addEventListener("DOMContentLoaded", function () {
    // Generate itinerary function
    function generateItinerary(destination, startDate, endDate, activities) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        if (days < 1) {
            document.getElementById("itinerary-details").innerHTML = "⚠️ Invalid date selection. Please check your input.";
            document.getElementById("itinerary-output").style.display = "block";
            return;
        }

        let itineraryHTML = `<h3>Itinerary for ${destination}</h3>`;
        for (let i = 0; i < days; i++) {
            let currentDate = new Date(start);
            currentDate.setDate(start.getDate() + i);
            let formattedDate = currentDate.toDateString();

            itineraryHTML += `
                <div class="day-section">
                    <h4>📅 ${formattedDate}</h4>
                    <p>🌅 Morning: ${activities[i % activities.length].trim()}.</p>
                    <p>🍽️ Afternoon: Enjoy a local meal.</p>
                    <p>🌆 Evening: Explore city nightlife or relax.</p>
                </div>
            `;
        }

        document.getElementById("itinerary-details").innerHTML = itineraryHTML;
        document.getElementById("itinerary-output").style.display = "block";
        document.getElementById("save-pdf").style.display = "inline-block";
        document.getElementById("save-calendar").style.display = "inline-block";
    }

    // Form submission event
    document.getElementById("itinerary-form").addEventListener("submit", function (event) {
        event.preventDefault();
        const destination = document.getElementById("destination").value;
        const startDate = document.getElementById("start-date").value;
        const endDate = document.getElementById("end-date").value;
        const activities = document.getElementById("activities").value.split(",");

        if (!destination || !startDate || !endDate || activities.length === 0) {
            alert("⚠️ Please fill in all fields before generating an itinerary.");
            return;
        }

        generateItinerary(destination, startDate, endDate, activities);
    });

    // Save as PDF using jsPDF
    document.getElementById("save-pdf").addEventListener("click", function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let itineraryText = document.getElementById("itinerary-details").innerText;
        
        doc.text(itineraryText, 10, 10);
        doc.save("Itinerary.pdf");
    });

    // Download as Calendar Event (iCal)
    document.getElementById("save-calendar").addEventListener("click", function () {
        const destination = document.getElementById("destination").value;
        const startDate = document.getElementById("start-date").value.replace(/-/g, "");
        const endDate = document.getElementById("end-date").value.replace(/-/g, "");

        let icalData = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Trip to ${destination}\nDTSTART:${startDate}T000000Z\nDTEND:${endDate}T235900Z\nDESCRIPTION:Planned trip itinerary\nEND:VEVENT\nEND:VCALENDAR`;

        let blob = new Blob([icalData], { type: "text/calendar" });
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "itinerary.ics";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});