async function updateCurrentUrl() {
        
    try {
        const tabs = await chrome.tabs.query({active: true, currentWindow: true});
        const currentTab = tabs[0]; //get the current tab   
        const currentUrl = currentTab.url; //get the current URL    
        
        document.getElementById('current-url').textContent = truncateUrl(currentUrl);                   
    } catch (error) {
        console.error('Error updating current URL:', error);
    }
} 
            

document.addEventListener('DOMContentLoaded', function() {
    updateCurrentUrl();
}); //fetch the current URL when the popup is loaded

document.getElementById('refresh-scan').addEventListener('click', function() {
    updateCurrentUrl();
}); //refresh button

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if (changeInfo.status === 'complete') {
        updateCurrentUrl();
    }
}); //auto-refresh when the user changes tabs.

function truncateUrl(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname; //return the hostname of the URL
    } catch (error) {
        console.error('Error parsing URL:', error);
    }
}; //shorten the url to just the hostname (domain name)

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;

    if (userInput) {
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
        document.getElementById('user-input').value = ''; // Clear input

        // Send the user input to the Flask backend
        const response = await fetch('http://127.0.0.1:5000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userInput }), // Send the user input to the server
        });

        const data = await response.json();
        chatBox.innerHTML += `<p><strong>Assistant:</strong> ${data.response}</p>`;
    }
}

// Add event listener for the send button
document.getElementById('send-button').addEventListener('click', sendMessage);
