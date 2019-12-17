package org.codice.ddf.attribute.enumerations;

import static org.apache.commons.lang.StringUtils.isBlank;

import com.google.common.collect.Sets;
import ddf.catalog.data.AttributeInjector;
import ddf.catalog.data.Metacard;
import ddf.catalog.data.MetacardType;
import ddf.catalog.data.impl.AttributeImpl;
import ddf.catalog.data.impl.MetacardImpl;
import ddf.catalog.validation.AttributeValidatorRegistry;
import ddf.catalog.validation.violation.ValidationViolation;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import javax.annotation.Nullable;

public class EnumerationExtractor {
  private final AttributeValidatorRegistry attributeValidatorRegistry;

  private final List<MetacardType> metacardTypes;

  private final List<AttributeInjector> attributeInjectors;

  /**
   * @param attributeValidatorRegistry validators to build enumerations from
   * @param metacardTypes metacard types to associate attributes with types
   * @param attributeInjectors injected attributes
   */
  public EnumerationExtractor(
      AttributeValidatorRegistry attributeValidatorRegistry,
      List<MetacardType> metacardTypes,
      List<AttributeInjector> attributeInjectors) {
    this.attributeValidatorRegistry = attributeValidatorRegistry;
    this.metacardTypes = metacardTypes;
    this.attributeInjectors = attributeInjectors;
  }

  public Map<String, Set<String>> getAttributeEnumerations(String attribute) {
    return attributeValidatorRegistry
        .getValidators(attribute)
        .stream()
        .map(av -> av.validate(new AttributeImpl(attribute, "null")))
        .filter(Optional::isPresent)
        .map(Optional::get)
        .filter(avr -> !avr.getSuggestedValues().isEmpty())
        .map(
            avr ->
                avr.getAttributeValidationViolations()
                    .stream()
                    .map(ValidationViolation::getAttributes)
                    .flatMap(Set::stream)
                    .distinct()
                    .collect(Collectors.toMap(o -> o, o -> avr.getSuggestedValues())))
        .reduce(
            (m1, m2) -> {
              m2.entrySet().forEach(e -> m1.merge(e.getKey(), e.getValue(), Sets::union));
              return m1;
            })
        .orElseGet(HashMap::new);
  }

  public Map<String, Set<String>> getEnumerations(@Nullable String metacardType) {
    if (isBlank(metacardType)) {
      metacardType = MetacardImpl.BASIC_METACARD.getName();
    }
    MetacardType type = getTypeFromName(metacardType);

    if (type == null) {
      return new HashMap<>();
    }

    type = applyInjectors(type, attributeInjectors);

    return type.getAttributeDescriptors()
        .stream()
        .flatMap(
            ad ->
                attributeValidatorRegistry
                    .getValidators(ad.getName())
                    .stream()
                    .map(av -> av.validate(new AttributeImpl(ad.getName(), "null"))))
        .filter(Optional::isPresent)
        .map(Optional::get)
        .filter(avr -> !avr.getSuggestedValues().isEmpty())
        .map(
            avr ->
                avr.getAttributeValidationViolations()
                    .stream()
                    .map(ValidationViolation::getAttributes)
                    .flatMap(Set::stream)
                    .distinct()
                    .collect(Collectors.toMap(o -> o, o -> avr.getSuggestedValues())))
        .reduce(
            (m1, m2) -> {
              m2.entrySet().forEach(e -> m1.merge(e.getKey(), e.getValue(), Sets::union));
              return m1;
            })
        .orElseGet(HashMap::new);
  }

  @Nullable
  private MetacardType getTypeFromName(String metacardType) {
    return metacardTypes
        .stream()
        .filter(mt -> mt.getName().equals(metacardType))
        .findFirst()
        .orElse(null);
  }

  private MetacardType applyInjectors(MetacardType original, List<AttributeInjector> injectors) {
    Metacard metacard = new MetacardImpl(original);
    for (AttributeInjector injector : injectors) {
      metacard = injector.injectAttributes(metacard);
    }
    return metacard.getMetacardType();
  }
}
