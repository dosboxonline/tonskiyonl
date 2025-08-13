document.addEventListener('DOMContentLoaded', function () {
    const videos = document.querySelectorAll('video'); // Находим все видео на странице

    videos.forEach((video, index) => {
        const videoKey = 'lastPlayedTime_' + encodeURIComponent(window.location.pathname) + '_video' + index;

        // Устанавливаем время воспроизведения из localStorage
        const lastPlayedTime = localStorage.getItem(videoKey);
        if (lastPlayedTime && parseFloat(lastPlayedTime) > 0) {
            video.currentTime = parseFloat(lastPlayedTime);
        }

        let hasInteractedWithVideo = false;

        // Обновляем флаг при изменении времени воспроизведения
        video.addEventListener('timeupdate', () => {
            hasInteractedWithVideo = true;
        });

        // Сохраняем время воспроизведения перед выходом, если пользователь взаимодействовал с видео
        window.addEventListener('beforeunload', () => {
            if (hasInteractedWithVideo) {
                localStorage.setItem(videoKey, video.currentTime);
            }
        });
    });
});