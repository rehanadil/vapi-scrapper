(function () {
    let currentDropdownIndex = 1;
    let isProcessing = false;
    let analyticsRequestPending = false;
    let analyticsCount = 0;
    let dropdownTrigger = null;

    // Intercept fetch requests to monitor analytics endpoints
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const response = await originalFetch(...args);
        try {
            const url = typeof args[0] === 'string' ? args[0] : args[0].url;
            if (url.includes("/analytics")) {
                analyticsRequestPending = true;
                console.log("[Rehan VS] Analytics Request Started", url);
                const clone = response.clone();
                const data = await clone.json();
                console.log("[Rehan VS] Analytics Data", data);

                if (!data || !Array.isArray(data) || data.length < 1 || !String(data[0].name).toLowerCase().includes("llm")) {
                    return response;
                }

                let totalResults = data.reduce((total, item) => {
                    return total + (item.hasOwnProperty("result") && Array.isArray(item.result) ? item.result.length : 0);
                }, 0);

                if (totalResults < 1) {
                    console.log("[Rehan VS] No results found, skipping...");
                    analyticsRequestPending = false;
                    return response;
                }

                if (analyticsCount < 1)
                    startAutomation();
                else {
                    const stepType = data[0]?.timeRange?.step || null;
                    if (stepType === "minute") {
                        fetch("http://localhost:3001/metrics/bulk-update", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "abc123"
                            },
                            body: JSON.stringify({ updateAll: true, metrics: data })
                        }).then(res => res.json())
                            .then(result => console.log("[Rehan VS] Metrics Bulk Update Result", result))
                            .catch(err => console.error("[Rehan VS] Metrics Bulk Update Error", err));
                    }
                }

                analyticsCount++;
                analyticsRequestPending = false;
                console.log("[Rehan VS] Analytics Request Completed");
            }
        } catch (err) {
            console.error("[Rehan VS] Error intercepting analytics request:", err);
            analyticsRequestPending = false;
        }
        return response;
    };

    // Utility to find element by exact text content
    function findElementByText(text) {
        const elements = document.querySelectorAll('body *'); // all elements inside body
        for (const el of elements) {
            // Normalize: remove all whitespace (tabs/newlines/spaces) between words
            const normalized = el.textContent.replace(/\s+/g, ' ').trim();
            if (normalized === text) {
                return el;
            }
        }
        return null;
    }

    // Wait for element by text content to be available
    function waitForElementByText(text, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const element = findElementByText(text);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const element = findElementByText(text);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element with text "${text}" not found within ${timeout}ms`));
            }, timeout);
        });
    }

    // Wait for element to be available
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

    // Wait for analytics request to complete
    function waitForAnalyticsComplete(timeout = 30000) {
        return new Promise((resolve, reject) => {
            const checkInterval = 100;
            let elapsed = 0;

            const check = () => {
                if (!analyticsRequestPending) {
                    resolve();
                    return;
                }

                elapsed += checkInterval;
                if (elapsed >= timeout) {
                    reject(new Error("Analytics request timeout"));
                    return;
                }

                setTimeout(check, checkInterval);
            };

            check();
        });
    }

    // Process next dropdown item
    async function processNextDropdownItem() {
        if (isProcessing) return;
        isProcessing = true;

        try {
            console.log("[Rehan VS] Automation Starting dropdown automation...", dropdownTrigger);

            // Calculate date range: 1 month ago to today
            const today = new Date();
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(today.getMonth() - 1);

            // Format dates as MM/DD/YYYY
            const formatDate = (date) => {
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const year = date.getFullYear();
                return `${month}/${day}/${year}`;
            };

            const dateRangeText = `${formatDate(oneMonthAgo)} - ${formatDate(today)}`;
            let daterangeDropdown = findElementByText(dateRangeText);
            if (daterangeDropdown) {
                daterangeDropdown = daterangeDropdown.querySelector('[type="button"]');

                if (daterangeDropdown) {
                    daterangeDropdown.dispatchEvent(new Event('click', { bubbles: true }));

                    setTimeout(() => {
                        const todayButton = document.querySelector('button[name="day"].bg-accent.text-accent-foreground');

                        if (todayButton) {
                            todayButton.dispatchEvent(new Event('click', { bubbles: true }));

                            setTimeout(() => {
                                todayButton.dispatchEvent(new Event('click', { bubbles: true }));

                                setTimeout(() => {
                                    isProcessing = false;
                                    processNextDropdownItem();
                                }, 2000);
                            }, 1000);
                        }
                    }, 1000);
                }
                return;
            }

            let timeDropdown = findElementByText("Minutes");
            if (!timeDropdown) {
                timeDropdown = findElementByText("Days");
                console.log("[Rehan VS] Automation Time dropdown found", timeDropdown);

                if (!timeDropdown) {
                    console.log("[Rehan VS] Automation Time dropdown not found yet, retrying...");
                    setTimeout(() => {
                        isProcessing = false;
                        processNextDropdownItem();
                    }, 2000);
                    return;
                }

                timeDropdown.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
                console.log("[Rehan VS] Automation Clicked time dropdown", timeDropdown);

                setTimeout(() => {
                    const timeItems = document.querySelectorAll('[data-radix-menu-content] [data-radix-collection-item]');
                    timeItems.forEach(item => {
                        if (item.textContent.includes("Minutes")) {
                            item.dispatchEvent(new Event('click', { bubbles: true }));
                            console.log("[Rehan VS] Automation Selected 'Minutes' from time dropdown", item);

                            setTimeout(() => {
                                isProcessing = false;
                                processNextDropdownItem();
                            }, 2000);
                        }
                    });
                }, 1000);
                return;
            }

            // Wait for dropdown to appear
            let dropdown = document.querySelector('[cmdk-group-items]');
            console.log("[Rehan VS] Automation Dropdown appeared", dropdown);

            if (!dropdown) {
                // Click dropdown trigger
                // const trigger = await waitForElement('[data-dropdown-trigger]')
                if (!dropdownTrigger) {
                    dropdownTrigger = findElementByText("All Assistants");
                    console.log("[Rehan VS] Automation Clicking dropdown trigger", dropdownTrigger);
                }

                if (dropdownTrigger) {
                    dropdownTrigger.click();
                }

                setTimeout(() => {
                    isProcessing = false;
                    processNextDropdownItem();
                }, 1000);
                return;
            }

            // Get all dropdown items
            const items = dropdown.querySelectorAll('[cmdk-item]');
            console.log(`[Rehan VS] Automation Found ${items.length} dropdown items`);

            if (currentDropdownIndex >= items.length) {
                console.log("[Rehan VS] Automation All items processed. Stopping.");
                return;
            }

            // Click current item
            const currentItem = items[currentDropdownIndex];
            console.log(`[Rehan VS] Automation Clicking item ${currentDropdownIndex + 1}/${items.length}`);
            currentItem.click();

            // Wait for analytics to complete
            console.log("[Rehan VS] Automation Waiting for analytics to complete...");
            await waitForAnalyticsComplete();
            console.log("[Rehan VS] Automation Analytics completed");

            // Move to next item
            currentDropdownIndex++;

            // Process next item after a short delay
            setTimeout(() => {
                isProcessing = false;
                processNextDropdownItem();
            }, 5000);

        } catch (error) {
            console.error("[Rehan VS] Automation Error", error);
            isProcessing = false;
        }
    }

    // Start automation when page is fully loaded
    function startAutomation() {
        if (document.readyState === 'complete') {
            console.log("[Rehan VS] Automation Page loaded, starting automation in 2 seconds...");
            setTimeout(processNextDropdownItem, 2000);
        } else {
            window.addEventListener('load', () => {
                console.log("[Rehan VS] Automation Page loaded, starting automation in 2 seconds...");
                setTimeout(processNextDropdownItem, 2000);
            });
        }
    }
})();
