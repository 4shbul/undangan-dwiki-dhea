/* =========================================
   HELPER
========================================== */

const $ = (selector) => {
  return document.querySelector(selector);
};


/* =========================================
   YOUTUBE PLAYER
========================================== */

const music = $("#bgMusic");

let isPlaying = false;


function playMusic() {

  if (music) {

    music.currentTime = 212;

    music.play().catch(function() {

      console.log(
        "Autoplay diblokir browser."
      );

    });

    isPlaying = true;

  }

}


function pauseMusic() {

  if (music) {

    music.pause();

    isPlaying = false;

  }

}


/* =========================================
   LOADING SCREEN
========================================= */

window.addEventListener("load", () => {

  setTimeout(() => {

    const loader = $("#loader");

    if (loader) {
      loader.classList.add("hide");
    }

  }, 500);

});


/* =========================================
   NAMA TAMU DARI URL
========================================= */

/*
   Contoh:

   index.html?to=Ashabul+Khaer

   atau:

   index.html?to=Keluarga+Pak+Andi
*/

const params = new URLSearchParams(
  window.location.search
);

const guest = params.get("to");

if (guest) {

  const decodedGuest =
    decodeURIComponent(
      guest.replace(/\+/g, " ")
    );

  const guestElement =
    $("#guestName");

  if (guestElement) {
    guestElement.textContent =
      decodedGuest;
  }

}


/* =========================================
   OPEN INVITATION
========================================= */

const openBtn = $("#openBtn");

const content = $("#content");

const musicToggle =
  $("#musicToggle");


if (openBtn) {

  openBtn.addEventListener(
    "click",
    () => {

      /*
        Tampilkan isi undangan
      */

      content.classList.add("open");


      /*
        Coba memainkan musik
      */

      playMusic();


      /*
        Scroll ke section mempelai
      */

      setTimeout(() => {

        const couple =
          $("#mempelai");

        if (couple) {

          couple.scrollIntoView({
            behavior: "smooth"
          });

        }

      }, 100);

    }
  );

}


/* =========================================
   MUSIC TOGGLE
========================================= */

if (musicToggle) {

  musicToggle.addEventListener(
    "click",
    () => {

      /*
        Jika musik sedang berhenti
      */

      if (!isPlaying) {

        playMusic();

        musicToggle.textContent = "♫";

      }

      /*
        Jika musik sedang dimainkan
      */

      else {

        pauseMusic();

        musicToggle.textContent = "×";

      }

    }
  );

}


/* =========================================
   COUNTDOWN
========================================= */

/*
  Target:

  19 September 2026
  09:00 WITA

  WITA = UTC+8
*/

const targetDate =
  new Date(
    "2026-09-19T09:00:00+08:00"
  ).getTime();


function updateCountdown() {

  let difference =
    Math.max(
      0,
      targetDate - Date.now()
    );


  /*
    Hari
  */

  const days =
    Math.floor(
      difference / 86400000
    );

  difference %= 86400000;


  /*
    Jam
  */

  const hours =
    Math.floor(
      difference / 3600000
    );

  difference %= 3600000;


  /*
    Menit
  */

  const minutes =
    Math.floor(
      difference / 60000
    );

  difference %= 60000;


  /*
    Detik
  */

  const seconds =
    Math.floor(
      difference / 1000
    );


  /*
    Update HTML
  */

  const daysElement =
    $("#days");

  const hoursElement =
    $("#hours");

  const minutesElement =
    $("#minutes");

  const secondsElement =
    $("#seconds");


  if (daysElement) {

    daysElement.textContent =
      String(days)
        .padStart(2, "0");

  }


  if (hoursElement) {

    hoursElement.textContent =
      String(hours)
        .padStart(2, "0");

  }


  if (minutesElement) {

    minutesElement.textContent =
      String(minutes)
        .padStart(2, "0");

  }


  if (secondsElement) {

    secondsElement.textContent =
      String(seconds)
        .padStart(2, "0");

  }

}


/*
  Jalankan pertama kali
*/

updateCountdown();


/*
  Update setiap detik
*/

setInterval(
  updateCountdown,
  1000
);


/* =========================================
   SCROLL REVEAL
========================================= */

const revealObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach(
        (entry) => {

          if (
            entry.isIntersecting
          ) {

            entry.target
              .classList
              .add("visible");

          }

        }
      );

    },
    {
      threshold: 0.12
    }
  );


document
  .querySelectorAll(".reveal")
  .forEach(
    (element) => {

      revealObserver.observe(
        element
      );

    }
  );


/* =========================================
   RSVP / BUKU TAMU
========================================= */

/*
  Karena website ini static,
  data RSVP sementara disimpan
  menggunakan localStorage browser.

  Jika nanti ingin database,
  bagian ini dapat diganti dengan
  API/backend.
*/

const form =
  $("#rsvpForm");

const messages =
  $("#messages");


/*
  Ambil data sebelumnya
*/

let storedMessages =
  JSON.parse(
    localStorage.getItem(
      "weddingMessages"
    ) || "[]"
  );


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHtml(value) {

  return String(value)
    .replace(
      /[&<>"']/g,
      (character) => {

        const entities = {

          "&": "&amp;",

          "<": "&lt;",

          ">": "&gt;",

          '"': "&quot;",

          "'": "&#039;"

        };

        return entities[
          character
        ];

      }
    );

}


/* =========================================
   RENDER MESSAGES
========================================= */

function renderMessages() {

  if (!messages) {
    return;
  }


  /*
    Jika belum ada ucapan
  */

  if (
    storedMessages.length === 0
  ) {

    messages.innerHTML = `

      <div class="message">

        <b>
          Doa & Ucapan
        </b>

        <p>
          Ucapan dari para tamu
          akan tampil di sini.
        </p>

      </div>

    `;

    return;

  }


  /*
    Tampilkan maksimal
    6 ucapan terakhir
  */

  messages.innerHTML =
    storedMessages
      .slice(-6)
      .reverse()
      .map(
        (item) => {

          return `

            <article class="message">

              <small>
                ${escapeHtml(
                  item.attendance
                )}
              </small>

              <b>
                ${escapeHtml(
                  item.name
                )}
              </b>

              <p>
                ${escapeHtml(
                  item.message
                )}
              </p>

            </article>

          `;

        }
      )
      .join("");

}


/*
  Render pertama kali
*/

renderMessages();


/* =========================================
   RSVP SUBMIT
========================================= */

if (form) {

  form.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      const formData =
        new FormData(form);


      const newMessage = {

        name:
          formData.get("name"),

        attendance:
          formData.get("attendance"),

        guests:
          formData.get("guests"),

        message:
          formData.get("message")

      };


      /*
        Simpan data
      */

      storedMessages.push(
        newMessage
      );


      /*
        Simpan ke localStorage
      */

      localStorage.setItem(
        "weddingMessages",
        JSON.stringify(
          storedMessages
        )
      );


      /*
        Render ulang
      */

      renderMessages();


      /*
        Reset form
      */

      form.reset();


      /*
        Kembalikan jumlah tamu
      */

      const guestInput =
        form.querySelector(
          'input[name="guests"]'
        );

      if (guestInput) {
        guestInput.value = 1;
      }


      /*
        Notifikasi
      */

      alert(
        "Terima kasih atas ucapan dan doanya."
      );

    }
  );

}


/* =========================================
   COPY REKENING
========================================= */

const copyButton =
  $("#copyBtn");

const accountNumber =
  $("#accountNumber");

const copyStatus =
  $("#copyStatus");


if (
  copyButton &&
  accountNumber
) {

  copyButton.addEventListener(
    "click",
    async () => {

      const number =
        accountNumber
          .textContent
          .trim();


      /*
        Clipboard API
      */

      try {

        await navigator
          .clipboard
          .writeText(number);


        if (copyStatus) {

          copyStatus.textContent =
            "Nomor rekening berhasil disalin.";

        }


        /*
          Ubah teks tombol
        */

        copyButton.textContent =
          "BERHASIL DISALIN";


        setTimeout(
          () => {

            copyButton.textContent =
              "SALIN NOMOR REKENING";

          },
          2000
        );

      }


      /*
        Jika clipboard tidak tersedia
      */

      catch (error) {

        if (copyStatus) {

          copyStatus.textContent =
            "Silakan salin nomor rekening secara manual.";

        }

      }

    }
  );

}


/* =========================================
   SHARE WHATSAPP
========================================= */

const shareWhatsApp =
  $("#shareWA");


if (shareWhatsApp) {

  const shareText =
    `
Undangan Pernikahan

Dwiki Rangga & Dhea Ananda

19 September 2026
09.00 WITA

Dusun Bonto Marahe,
Desa Possi Tanah,
Kecamatan Kajang,
Kabupaten Bulukumba.

${window.location.href}
    `.trim();


  shareWhatsApp.href =
    "https://wa.me/?text=" +
    encodeURIComponent(
      shareText
    );

}


/* =========================================
   OPTIONAL:
   PARALLAX FLORAL
========================================= */

const floralElements =
  document.querySelectorAll(
    ".floral"
  );


window.addEventListener(
  "scroll",
  () => {

    const scrollY =
      window.scrollY;


    floralElements.forEach(
      (floral, index) => {

        const movement =
          scrollY * 0.025;


        if (index % 2 === 0) {

          floral.style.transform =
            `translateY(${movement}px) rotate(-10deg)`;

        }

        else {

          floral.style.transform =
            `translateY(-${movement}px) scaleX(-1) rotate(-10deg)`;

        }

      }
    );

  },
  {
    passive: true
  }
);


/* =========================================
   PREVENT EMPTY MAP / LINK ISSUES
========================================= */

document
  .querySelectorAll(
    'a[href="#"]'
  )
  .forEach(
    (link) => {

      link.addEventListener(
        "click",
        (event) => {

          event.preventDefault();

        }
      );

    }
  );