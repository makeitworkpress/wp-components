<?php
/**
 * Rate component template
 */
$floor = floor($atom["value"]);
$fraction = $atom["value"] - $floor;

$fullStars = $fraction >= 0.75 ? round($atom["value"]) : $floor;
$halfStars = $fraction < 0.75 && $fraction > 0.25 ? 1 : 0;
$emptyStars = $atom["max"] - $fullStars - $halfStars;
?>

<div <?php echo $attributes; ?>>
    <?php if ($atom["schema"]) { ?>
        <meta itemprop="ratingValue" content="<?php echo $atom["value"]; ?>" />
        <meta itemprop="bestRating" content="<?php echo $atom["max"]; ?>" />
        <meta itemprop="worstRating" content="<?php echo $atom["min"]; ?>" />

        <?php if (isset($atom["attributes"]["itemtype"]) && $atom["attributes"]["itemtype"] == "http://schema.org/AggregateRating") { ?>
            <meta itemprop="reviewCount" content="<?php echo $atom["count"]; ?>" />
        <?php } ?>

        <?php if ($atom["reviewed"]) { ?>
            <meta itemprop="itemReviewed" content="<?php echo esc_attr($atom["reviewed"]); ?>" />
        <?php } ?>

        <?php if ($atom["author"]) { ?>
            <meta itemprop="author" itemscope="itemscope" itemtype="<?php echo $atom["author_type"]; ?>" content="<?php echo esc_attr($atom["author"]); ?>" />
        <?php } ?>
    <?php } ?>

    <a class="atom-rate-anchor">
        <?php
        for ($i = 1; $i <= $fullStars; $i++) {
            echo '<i class="fas fa-star atom-rate-star"></i>';
        }

        if ($halfStars) {
            echo '<i class="fas fa-star-half atom-rate-star"></i>';
        }

        for ($i = 1; $i <= $emptyStars; $i++) {
            echo '<i class="far fa-star atom-rate-star"></i>';
        }
        ?>
    </a>
    <i class="fas fa-circle-notch fa-spin"></i>
</div>
