<?php
/**
 * Displays a rating component
 */

// Atom values
$atom   = wp_parse_args( $atom, array(
    'count'        => 0,
    'rate'         => true, 
    'style'        => 'default',
    'itemprop'     => 'aggregateRating',
    'itemtype'     => 'http://schema.org/AggregateRating',
    'value'        => 0
) );

// If we allow users to rate
$atom['style']  .= $atom['rate'] ? ' rate-do' : '';
?>
<div class="atom-rate <?php echo $atom['style']; ?>" itemprop="<?php echo $atom['itemprop']; ?>" itemscope="itemscope" itemtype="<?php echo $atom['itemtype']; ?>">

</div>