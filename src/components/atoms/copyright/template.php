<?php
/**
 * Copyright component template
 */
?>

<div <?php echo $attributes; ?>>
    <?php echo $atom["copyright"]; ?> <span itemprop="copyrightYear"><?php echo $atom["date"]; ?></span>

    <span itemprop="copyrightHolder" itemscope="itemscope" itemtype="<?php echo $atom["itemtype"]; ?>">
        <span itemprop="name"><?php echo $atom["name"]; ?></span>
    </span>
</div>
